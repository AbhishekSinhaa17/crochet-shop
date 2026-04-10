-- 1. Ensure Foreign Key relationship from messages to profiles for the UI join
ALTER TABLE IF EXISTS public.messages 
DROP CONSTRAINT IF EXISTS messages_sender_id_fkey;

ALTER TABLE public.messages
ADD CONSTRAINT messages_sender_id_fkey 
FOREIGN KEY (sender_id) 
REFERENCES profiles(id);

-- 2. Enable RLS on conversations and messages if not already enabled
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 3. DROP old policies to avoid duplicates
DROP POLICY IF EXISTS "Users can view their own conversations" ON public.conversations;
DROP POLICY IF EXISTS "Admins can view all conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON public.messages;
DROP POLICY IF EXISTS "Users can insert messages in their conversations" ON public.messages;

-- 4. CONVERSATION POLICIES
-- Policy for customers to see their own conversations
CREATE POLICY "Users can view their own conversations" 
ON public.conversations 
FOR SELECT 
USING (auth.uid() = customer_id);

-- Policy for admins to see all conversations
CREATE POLICY "Admins can view all conversations" 
ON public.conversations 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- 5. MESSAGE POLICIES
-- Simple policy: If you are part of the conversation (as customer or admin), you see ALL messages
CREATE POLICY "Full message visibility for conversation participants" 
ON public.messages 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM conversations 
    WHERE conversations.id = messages.conversation_id 
    AND (
      conversations.customer_id = auth.uid() 
      OR EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
      )
    )
  )
);

-- 6. Grant basic permissions to authenticated users
GRANT ALL ON TABLE public.conversations TO authenticated;
GRANT ALL ON TABLE public.messages TO authenticated;
GRANT ALL ON TABLE public.profiles TO authenticated;
