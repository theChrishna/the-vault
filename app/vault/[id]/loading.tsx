import { Loader2 } from 'lucide-react';

export default function Loading() {
  // You can add any UI you want here.
  // This simple one mimics the other loading states in your app.
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F0F3FB]">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-gray-500" />
        <h1 className="text-xl font-medium text-gray-700">
          Unsealing your capsule...
        </h1>
      </div>
    </div>
  );
}