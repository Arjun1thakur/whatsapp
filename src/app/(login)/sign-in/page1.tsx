'use client'

import { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/config/config';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowBigLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const {toast} = useToast();

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      toast({
        title: 'Signed in successfully',
        description: 'You have been signed in successfully',
      })
      router.push('/dashboard');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error signing in',
        description: 'There was an error signing in with Google',
      })
    }
  };

  const signInWithEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: 'Signed in successfully',
        description: 'You have been signed in successfully',
      })
      router.push('/dashboard');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error signing in',
        description: 'There was an error signing in with email and password',
      })
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-sidebar-background">
      <Link href="/" className='absolute group top-4 left-4 md:top-8 md:left-12 flex gap-2 items-center'>
       <ArrowBigLeft className='group-hover:-translate-x-1 duration-200' /> Back
      </Link>
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Sign in to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={signInWithEmail} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" className="w-full">Sign In with Email</Button>
          </form>
        </CardContent>
        <CardFooter>
          <Button onClick={signInWithGoogle} variant="outline" className="w-full">
            Sign In with Google
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

