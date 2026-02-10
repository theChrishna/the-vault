import Link from 'next/link';
import Image from 'next/image';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  ArrowRight, Rocket, Brain, Leaf, Lock, Mail, Hourglass,
  Eye, Archive, Github, Twitter, MessageSquare, CheckCircle
} from 'lucide-react';

export default function LandingPage() {
  return (
    // Background: Light Grey (Light Mode) / Deep Charcoal (Dark Mode)
    <div className="min-h-screen bg-[#F0F3FB] dark:bg-background-dark text-gray-900 dark:text-text-main-dark transition-colors duration-300 relative overflow-x-hidden">

      {/* Noise Texture Overlay (Optional - adds texture in dark mode) */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-noise opacity-30 mix-blend-overlay"></div>

      {/* --- NAVIGATION --- */}
      <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#F0F3FB]/80 dark:bg-background-dark/80 border-b border-gray-200/50 dark:border-white/5">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo Section */}
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="w-10 h-10 relative">  {/* Slightly adjusted size for image */}
                <Image
                  src="/logo.png"
                  alt="The Goal Time Capsule Logo"
                  fill
                  className="object-contain" // Ensures logo isn't stretched
                  priority
                />
              </div>
              <span className="font-serif font-medium text-lg tracking-tight text-gray-900 dark:text-white/90">
                The Goal Time Capsule
              </span>
            </div>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#how-it-works" className="text-sm font-medium text-gray-600 dark:text-text-muted-dark hover:text-black dark:hover:text-white transition-colors">How it works</a>
              <a href="#philosophy" className="text-sm font-medium text-gray-600 dark:text-text-muted-dark hover:text-black dark:hover:text-white transition-colors">Philosophy</a>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link href="/login" className="hidden sm:block text-sm font-medium text-gray-600 dark:text-text-muted-dark hover:text-black dark:hover:text-white transition-colors">
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black px-5 py-2 rounded-full text-sm font-medium transition-all shadow-glow hover:shadow-lg flex items-center gap-2 group"
              >
                Get Started
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div >
        </div >
      </nav >

      <main className="relative z-10">
        {/* --- HERO SECTION --- */}
        <section className="pt-24 pb-32 overflow-hidden">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="font-serif text-5xl md:text-7xl font-normal leading-tight mb-8 tracking-tight text-gray-900 dark:text-text-main-dark">
              Write to Your Future Self. <br />
              <span className="italic text-primary">Let Time Answer.</span>
            </h1>

            <p className="max-w-xl mx-auto text-sm md:text-base text-gray-600 dark:text-text-muted-dark mb-10 leading-relaxed font-light tracking-wide">
              In a world obsessed with immediate results, we offer the luxury of patience.
              Lock away your hopes, fears, and ambitions today, and rediscover them when you need them most.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link href="/register" className="bg-black dark:bg-white text-white dark:text-black px-8 py-3 rounded-full text-sm font-medium transition-all hover:bg-gray-800 dark:hover:bg-gray-200 shadow-glow flex items-center gap-2 hover:-translate-y-1">
                Create Your First Reflection
                <Rocket className="w-4 h-4" />
              </Link>
              <Link href="/login" className="px-8 py-3 rounded-full text-sm font-medium border border-gray-300 dark:border-white/20 hover:border-gray-400 dark:hover:border-white/40 hover:bg-gray-100 dark:hover:bg-white/5 transition-all flex items-center gap-2 group text-gray-700 dark:text-text-main-dark">
                Log In
                <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Social Proof / Icons */}
            <div className="flex items-center justify-center gap-6 text-gray-400 dark:text-text-muted-dark mb-20">
              <Github className="w-5 h-5 hover:text-black dark:hover:text-white transition-colors cursor-pointer" />
              <Twitter className="w-5 h-5 hover:text-blue-400 transition-colors cursor-pointer" />
              <MessageSquare className="w-5 h-5 hover:text-indigo-500 transition-colors cursor-pointer" />
            </div>

            {/* Hero Image / Visualization */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-white/10 group mx-4 md:mx-0 max-w-[1000px] mx-auto bg-white dark:bg-black">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 pointer-events-none z-10"></div>

              {/* Fallback image */}
              <img
                alt="Atmospheric Background"
                className="absolute inset-0 w-full h-full object-cover opacity-90 dark:brightness-[0.4] dark:saturate-[0.8] dark:contrast-[1.1]"
                src="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=2074&auto=format&fit=crop"
              />

              <div className="relative z-20 w-full h-[500px] md:h-[600px] flex items-center justify-center p-8 md:p-16">
                <div className="w-full h-full backdrop-blur-xl bg-white/80 dark:bg-black/40 rounded-xl border border-gray-200 dark:border-white/10 shadow-glass flex flex-col overflow-hidden">
                  {/* Browser Bar */}
                  <div className="h-10 border-b border-gray-200 dark:border-white/5 bg-gray-100/50 dark:bg-white/5 flex items-center px-4 gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400/60"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400/60"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400/60"></div>
                    <div className="ml-4 w-full max-w-sm h-6 bg-white dark:bg-white/5 rounded-md flex items-center px-3 border border-gray-200 dark:border-white/5">
                      <span className="text-[10px] text-gray-400 dark:text-white/40 flex items-center gap-1 font-sans">
                        <Lock className="w-3 h-3" /> goaltimecapsule.com/my-capsule
                      </span>
                    </div>
                  </div>

                  {/* Content Inside the Fake Browser */}
                  <div className="flex-1 p-8 md:p-12 flex flex-col items-center justify-center text-center">
                    <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-4 block">Scheduled: Nov 14, 2029</span>
                    <h3 className="font-serif text-3xl md:text-5xl text-gray-900 dark:text-white mb-6 drop-shadow-sm tracking-tight">My hopes for the decade</h3>
                    <p className="text-lg text-gray-600 dark:text-white/80 leading-relaxed italic font-serif font-light">
                      "I hope I&apos;ve learned to be kinder to myself. I hope the career change wasn&apos;t as scary as it feels right now..."
                    </p>
                    <div className="mt-10 flex justify-center w-full">
                      <div className="h-0.5 w-32 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-1/3 shadow-[0_0_10px_rgba(255,107,74,0.5)]"></div>
                      </div>
                    </div>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 dark:text-white/40 mt-3 font-sans">unlocking in 5 years</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- SECTION 2: A MIRROR ACROSS TIME --- */}
        <section id="philosophy" className="py-24 bg-white dark:bg-background-dark z-10 relative border-t border-gray-100 dark:border-white/5">
          <div className="max-w-[1100px] mx-auto px-6 sm:px-8">
            <div className="text-center mb-20">
              <h2 className="font-serif text-4xl md:text-5xl font-medium mb-4 text-gray-900 dark:text-text-main-dark">A Mirror Across Time</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="p-8 rounded-2xl bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all duration-300 group shadow-sm hover:shadow-soft">
                <div className="w-10 h-10 rounded-full bg-white dark:bg-background-dark flex items-center justify-center mb-6 text-black dark:text-white border border-gray-200 dark:border-white/10 group-hover:border-primary/50 transition-colors">
                  <Rocket className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-2xl mb-3 text-gray-900 dark:text-text-main-dark">Ambitions</h3>
                <p className="text-sm text-gray-600 dark:text-text-muted-dark leading-relaxed font-light">
                  Document your current goals without the pressure of immediate execution. See how your definition of success evolves.
                </p>
              </div>

              {/* Card 2 */}
              <div className="p-8 rounded-2xl bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all duration-300 group shadow-sm hover:shadow-soft">
                <div className="w-10 h-10 rounded-full bg-white dark:bg-background-dark flex items-center justify-center mb-6 text-black dark:text-white border border-gray-200 dark:border-white/10 group-hover:border-primary/50 transition-colors">
                  <Brain className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-2xl mb-3 text-gray-900 dark:text-text-main-dark">Fears</h3>
                <p className="text-sm text-gray-600 dark:text-text-muted-dark leading-relaxed font-light">
                  Confront what holds you back. Often, looking back at old fears reveals how much strength you&apos;ve gained since.
                </p>
              </div>

              {/* Card 3 */}
              <div className="p-8 rounded-2xl bg-gray-50 dark:bg-surface-dark border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all duration-300 group shadow-sm hover:shadow-soft">
                <div className="w-10 h-10 rounded-full bg-white dark:bg-background-dark flex items-center justify-center mb-6 text-black dark:text-white border border-gray-200 dark:border-white/10 group-hover:border-primary/50 transition-colors">
                  <Leaf className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-2xl mb-3 text-gray-900 dark:text-text-main-dark">Beliefs</h3>
                <p className="text-sm text-gray-600 dark:text-text-muted-dark leading-relaxed font-light">
                  Capture your philosophy of life at this moment. Watch your wisdom deepen and your perspectives shift over the years.
                </p>
              </div>
            </div>

            <div className="mt-24 text-center">
              <blockquote className="font-serif text-3xl italic text-gray-800 dark:text-white/90 max-w-4xl mx-auto leading-relaxed border-l-2 border-primary pl-8 text-left md:text-center md:border-l-0 md:pl-0">
                &quot;We do not learn from experience... we learn from reflecting on experience.&quot;
                <footer className="mt-6 text-xs font-sans not-italic font-bold tracking-[0.2em] uppercase text-primary">— John Dewey</footer>
              </blockquote>
            </div>
          </div>
        </section>

        {/* --- SECTION 3: HOW IT WORKS --- */}
        <section id="how-it-works" className="py-24 relative bg-gray-50 dark:bg-surface-dark border-y border-gray-200 dark:border-white/5 z-10">
          <div className="max-w-[1100px] mx-auto px-6 sm:px-8">
            <div className="relative">
              {/* Connecting Line */}
              <div className="absolute top-8 left-0 w-full h-px bg-gray-200 dark:bg-white/5 hidden md:block"></div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
                {/* Step 1 */}
                <div className="relative p-6 rounded-xl text-center md:text-left z-10 group">
                  <div className="w-16 h-16 rounded-full bg-white dark:bg-background-dark border border-gray-200 dark:border-white/10 flex items-center justify-center font-serif font-medium text-2xl mb-6 mx-auto md:mx-0 shadow-lg group-hover:border-primary/60 transition-colors text-black dark:text-white">1</div>
                  <h4 className="font-serif text-xl font-medium mb-2 text-gray-900 dark:text-text-main-dark">Write</h4>
                  <p className="text-sm text-gray-600 dark:text-text-muted-dark font-light">Pour your heart out. Text, voice, or image attachments supported.</p>
                </div>
                {/* Step 2 */}
                <div className="relative p-6 rounded-xl text-center md:text-left z-10 group">
                  <div className="w-16 h-16 rounded-full bg-white dark:bg-background-dark border border-gray-200 dark:border-white/10 flex items-center justify-center font-serif font-medium text-2xl mb-6 mx-auto md:mx-0 shadow-lg group-hover:border-primary/60 transition-colors text-black dark:text-white">2</div>
                  <h4 className="font-serif text-xl font-medium mb-2 text-gray-900 dark:text-text-main-dark">Lock</h4>
                  <p className="text-sm text-gray-600 dark:text-text-muted-dark font-light">Set a date. One month, one year, or one decade from now.</p>
                </div>
                {/* Step 3 */}
                <div className="relative p-6 rounded-xl text-center md:text-left z-10 group">
                  <div className="w-16 h-16 rounded-full bg-white dark:bg-background-dark border border-gray-200 dark:border-white/10 flex items-center justify-center font-serif font-medium text-2xl mb-6 mx-auto md:mx-0 shadow-lg group-hover:border-primary/60 transition-colors text-black dark:text-white">3</div>
                  <h4 className="font-serif text-xl font-medium mb-2 text-gray-900 dark:text-text-main-dark">Live</h4>
                  <p className="text-sm text-gray-600 dark:text-text-muted-dark font-light">Forget about it. Go live your life. Let time do its work.</p>
                </div>
                {/* Step 4 */}
                <div className="relative p-6 rounded-xl text-center md:text-left z-10 group">
                  <div className="w-16 h-16 rounded-full bg-white dark:bg-background-dark border border-gray-200 dark:border-white/10 flex items-center justify-center font-serif font-medium text-2xl mb-6 mx-auto md:mx-0 shadow-lg group-hover:border-primary/60 transition-colors text-black dark:text-white">4</div>
                  <h4 className="font-serif text-xl font-medium mb-2 text-gray-900 dark:text-text-main-dark">Reflect</h4>
                  <p className="text-sm text-gray-600 dark:text-text-muted-dark font-light">Receive your message when the time is right. Reflect on your journey.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- SECTION 4: THE UNLOCK MOMENT --- */}
        <section className="py-24 bg-white dark:bg-background-dark z-10 relative">
          <div className="max-w-[1100px] mx-auto px-6 sm:px-8">
            <div className="flex flex-col md:flex-row items-center gap-20">
              <div className="md:w-1/2">
                <span className="inline-block py-1 px-3 rounded-full text-[10px] font-bold tracking-widest text-primary border border-primary/20 uppercase mb-6">Growth</span>
                <h2 className="font-serif text-4xl md:text-5xl font-medium mb-6 text-gray-900 dark:text-text-main-dark leading-tight">The beauty of the <span class="italic text-primary">unread</span> letter.</h2>
                <p className="text-lg text-gray-600 dark:text-text-muted-dark mb-8 leading-relaxed font-light">
                  There is a unique magic in forgetting what you wrote, only to be reminded of your past self&apos;s wisdom. It’s like receiving advice from an old friend who knows you better than anyone else.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-primary mt-0.5 w-5 h-5" />
                    <span className="text-gray-700 dark:text-text-main-dark text-sm font-light">Secure encryption keeps your thoughts private until unlock.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-primary mt-0.5 w-5 h-5" />
                    <span className="text-gray-700 dark:text-text-main-dark text-sm font-light">Strict anti-tamper locks prevent peeking early.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-primary mt-0.5 w-5 h-5" />
                    <span className="text-gray-700 dark:text-text-main-dark text-sm font-light">Delivered via email and app notification precisely on time.</span>
                  </li>
                </ul>
              </div>

              {/* Notification Card UI */}
              <div className="md:w-1/2 w-full perspective-1000">
                <div className="relative transform transition-transform hover:scale-[1.02] duration-500">
                  <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 to-purple-500/10 blur-3xl opacity-30 rounded-full"></div>
                  <div className="relative bg-white dark:bg-black/40 backdrop-blur-xl rounded-2xl shadow-glass p-6 md:p-8 border border-gray-200 dark:border-white/10">
                    <div className="absolute -top-3 -right-3 bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-lg animate-bounce z-20">1</div>
                    <div className="border-b border-gray-100 dark:border-white/5 pb-4 mb-4 flex justify-between items-center">
                      <div className="flex items-center gap-2 text-gray-500 dark:text-text-muted-dark text-xs font-medium uppercase tracking-wide">
                        <Mail className="w-4 h-4" />
                        <span>Inbox</span>
                      </div>
                      <span className="text-[10px] text-gray-400 dark:text-text-muted-dark font-mono">10:42 AM</span>
                    </div>
                    <div className="space-y-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-black shadow-md">
                          <Hourglass className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-gray-900 dark:text-text-main-dark">The Goal Time Capsule</p>
                          <p className="text-xs text-gray-500 dark:text-text-muted-dark">to me</p>
                        </div>
                      </div>
                      <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-text-main-dark">Your Time Capsule has Unlocked! 🔓</h3>
                      <div className="p-4 bg-gray-50 dark:bg-surface-dark rounded-lg text-sm text-gray-600 dark:text-text-muted-dark italic border-l-2 border-primary/50 leading-relaxed">
                        "Dear Future Me, if you&apos;re reading this, I hope you finally took that trip to Japan..."
                      </div>
                      <button className="w-full bg-black dark:bg-white text-white dark:text-black py-3 rounded-lg font-medium text-xs uppercase tracking-wider mt-2 hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shadow-sm">
                        Read Full Letter
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- SECTION 5: FEATURES GRID --- */}
        <section className="py-24 border-t border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-background-dark z-10 relative">
          <div className="max-w-[1100px] mx-auto px-6 sm:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
              <div className="text-center group">
                <div className="w-12 h-12 mx-auto mb-4 text-gray-800 dark:text-text-main-dark group-hover:text-primary transition-colors duration-300">
                  <Lock className="w-8 h-8 mx-auto" />
                </div>
                <h4 className="font-serif font-medium text-lg mb-2 text-gray-900 dark:text-text-main-dark">Ironclad Privacy</h4>
                <p className="text-xs text-gray-500 dark:text-text-muted-dark leading-relaxed max-w-[150px] mx-auto font-light">Zero-knowledge encryption ensures only you hold the key.</p>
              </div>
              <div className="text-center group">
                <div className="w-12 h-12 mx-auto mb-4 text-gray-800 dark:text-text-main-dark group-hover:text-primary transition-colors duration-300">
                  <Archive className="w-8 h-8 mx-auto" />
                </div>
                <h4 className="font-serif font-medium text-lg mb-2 text-gray-900 dark:text-text-main-dark">Digital Archive</h4>
                <p className="text-xs text-gray-500 dark:text-text-muted-dark leading-relaxed max-w-[150px] mx-auto font-light">Organize your past thoughts into a searchable timeline.</p>
              </div>
              <div className="text-center group">
                <div className="w-12 h-12 mx-auto mb-4 text-gray-800 dark:text-text-main-dark group-hover:text-primary transition-colors duration-300">
                  <Hourglass className="w-8 h-8 mx-auto" />
                </div>
                <h4 className="font-serif font-medium text-lg mb-2 text-gray-900 dark:text-text-main-dark">Flexible Timing</h4>
                <p className="text-xs text-gray-500 dark:text-text-muted-dark leading-relaxed max-w-[150px] mx-auto font-light">Set specific dates or condition-based unlocking rules.</p>
              </div>
              <div className="text-center group">
                <div className="w-12 h-12 mx-auto mb-4 text-gray-800 dark:text-text-main-dark group-hover:text-primary transition-colors duration-300">
                  <Eye className="w-8 h-8 mx-auto" />
                </div>
                <h4 className="font-serif font-medium text-lg mb-2 text-gray-900 dark:text-text-main-dark">Clarity Mode</h4>
                <p className="text-xs text-gray-500 dark:text-text-muted-dark leading-relaxed max-w-[150px] mx-auto font-light">Distraction-free writing environment for deep thought.</p>
              </div>
            </div>
          </div>
        </section>

        {/* --- FINAL CTA --- */}
        <section className="py-32 bg-white dark:bg-surface-dark relative overflow-hidden z-10 border-t border-gray-200 dark:border-white/5">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none text-black dark:text-white w-[800px] h-[800px]">
            <svg className="w-full h-full animate-[spin_60s_linear_infinite]" fill="none" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
              <circle cx="300" cy="300" r="100" stroke="currentColor" strokeDasharray="10 20" strokeWidth="1"></circle>
              <circle cx="300" cy="300" r="180" stroke="currentColor" strokeWidth="1"></circle>
              <circle cx="300" cy="300" r="260" stroke="currentColor" strokeDasharray="4 8" strokeWidth="1"></circle>
            </svg>
          </div>
          <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
            <h2 className="font-serif text-5xl md:text-7xl font-medium mb-8 text-gray-900 dark:text-text-main-dark">Who are you <span className="italic text-primary">becoming</span>?</h2>
            <p className="text-xl text-gray-600 dark:text-text-muted-dark mb-12 max-w-2xl mx-auto font-light">
              Start a conversation with your future self today. It&apos;s the most honest conversation you&apos;ll ever have.
            </p>
            <Link href="/register" className="inline-block bg-black dark:bg-white text-white dark:text-black px-12 py-4 rounded-full text-lg font-medium transition-all shadow-glow hover:shadow-lg hover:-translate-y-1 hover:bg-gray-800 dark:hover:bg-gray-100">
              Start Your Capsule Now
            </Link>
            <p className="mt-6 text-sm text-gray-500 dark:text-text-muted-dark font-light">Free to start. No credit card required.</p>
          </div>
        </section>

        {/* --- FOOTER --- */}
        <footer className="bg-[#F0F3FB] dark:bg-background-dark pt-20 pb-10 border-t border-gray-200 dark:border-white/5 z-10 relative">
          <div className="max-w-[1100px] mx-auto px-6 sm:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
              <div className="col-span-1 md:col-span-2 lg:col-span-1">
                <h3 className="font-serif text-2xl font-medium mb-6 text-gray-900 dark:text-text-main-dark">The Goal Time Capsule</h3>
                <p className="text-gray-600 dark:text-text-muted-dark text-sm leading-relaxed mb-6 font-light">
                  Beautifully designed for introspection. Securely built for the long haul. We are the custodians of your personal history.
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-6 text-xs uppercase tracking-widest text-gray-500 dark:text-text-main-dark/50">Product</h4>
                <ul className="space-y-4 text-sm text-gray-600 dark:text-text-muted-dark font-light">
                  <li><a className="hover:text-primary transition-colors" href="#">Features</a></li>
                  <li><a className="hover:text-primary transition-colors" href="#">Pricing</a></li>
                  <li><a className="hover:text-primary transition-colors" href="#">For Teams</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-6 text-xs uppercase tracking-widest text-gray-500 dark:text-text-main-dark/50">Company</h4>
                <ul className="space-y-4 text-sm text-gray-600 dark:text-text-muted-dark font-light">
                  <li><a className="hover:text-primary transition-colors" href="#">About Us</a></li>
                  <li><a className="hover:text-primary transition-colors" href="#">Privacy Policy</a></li>
                  <li><a className="hover:text-primary transition-colors" href="#">Terms of Service</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-6 text-xs uppercase tracking-widest text-gray-500 dark:text-text-main-dark/50">Connect</h4>
                <ul className="space-y-4 text-sm text-gray-600 dark:text-text-muted-dark font-light">
                  <li><a className="hover:text-primary transition-colors" href="#">Twitter</a></li>
                  <li><a className="hover:text-primary transition-colors" href="#">GitHub</a></li>
                  <li><a className="hover:text-primary transition-colors" href="#">Email</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-200 dark:border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 dark:text-text-muted-dark font-light">
              <p>© 2025 The Goal Time Capsule. All rights reserved.</p>
              <div className="mt-4 md:mt-0 flex items-center gap-1">
                <span>Made with</span>
                <span className="text-primary text-xs">♥</span>
                <span>for the future.</span>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div >
  );
}