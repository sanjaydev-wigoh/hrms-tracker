
'use client';


import Home from './home';

export default function HamburgerMenu() {
  // const [isOpen, setIsOpen] = useState(true);
  // const router = useRouter();

  // const toggleMenu = () => setIsOpen((prev) => !prev);

  return (

    <div className="h-screen flex flex-col bg-white font-sans text-gray-800">
    {/* Top Navigation Bar */}
    {/* <div className="flex items-center  justify-between px-6 py-6 shadow-lg rounded-b-1xl">
      
      
      <div className="text-lg font-semibold tracking-wide">WigohTech Dashboard</div>
  
  
      <nav className="flex items-center space-x-8 text-sm md:text-base">


        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton>
              <button className="px-5 py-2 rounded-full border border-sky-600 text-sky-700 font-semibold hover:bg-sky-100 active:scale-95 transition-all duration-150">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton>
              <button className="px-5 py-2 rounded-full bg-violet-600 text-white font-semibold hover:bg-violet-700 active:scale-95 transition-all duration-150 shadow-md">
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>
  
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </nav>
    </div> */}
    {/* <Header/> */}
  
    {/* Main Content */}
    <main className="flex-1 ">
      <div >
        <Home />
      </div>
    </main>
  </div>
  

  );
}
