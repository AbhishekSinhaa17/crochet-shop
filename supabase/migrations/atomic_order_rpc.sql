-- Function to place an order and update stock atomically
CREATE OR REPLACE FUNCTION place_order_atomic(
    p_user_id UUID,
    p_order_number TEXT,
    p_total NUMERIC,
    p_subtotal NUMERIC,
    p_shipping_address JSONB,
    p_items JSONB,
    p_payment_method TEXT DEFAULT 'razorpay',
    p_status TEXT DEFAULT 'confirmed',
    p_payment_status TEXT DEFAULT 'paid'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_order_id UUID;
    v_item RECORD;
    v_product_stock INTEGER;
BEGIN
    -- 1. Create the order
    INSERT INTO orders (
        user_id, 
        order_number, 
        total, 
        subtotal, 
        items, 
        shipping_address, 
        payment_method,
        status,
        payment_status
    ) VALUES (
        p_user_id, 
        p_order_number, 
        p_total, 
        p_subtotal, 
        p_items, 
        p_shipping_address, 
        p_payment_method,
        p_status,
        p_payment_status
    ) RETURNING id INTO v_order_id;

    -- 2. Iterate through items to update stock
    FOR v_item IN SELECT * FROM jsonb_to_recordset(p_items) AS x(product_id UUID, quantity INTEGER)
    LOOP
        -- Check stock first
        SELECT stock INTO v_product_stock FROM products WHERE id = v_item.product_id FOR UPDATE;
        
        IF v_product_stock < v_item.quantity THEN
            RAISE EXCEPTION 'Insufficient stock for product %', v_item.product_id;
        END IF;

        -- Update stock
        UPDATE products 
        SET stock = stock - v_item.quantity,
            updated_at = NOW()
        WHERE id = v_item.product_id;
    END LOOP;

    -- 3. Return the created order
    RETURN jsonb_build_object(
        'id', v_order_id,
        'order_number', p_order_number
    );

EXCEPTION WHEN OTHERS THEN
    -- Rollback is implicit in PostgreSQL functions on exception
    RAISE;
END;
$$;
