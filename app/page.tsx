import { redirect } from 'next/navigation';

export default function Home() {
  // Instantly redirect anyone visiting "/" to "/login"
  redirect('/login');
}
