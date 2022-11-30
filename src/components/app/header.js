function AppHeader() {
  return (
    <div class="app-header">
      <nav class="fixed flex justify-between py-6 w-full lg:px-48 md:px-12 px-4 content-center bg-secondary z-10">
        <div class="flex items-center">
          <img src='dist/assets/Logo_black.svg' alt="Logo" class="h-4" />
        </div>
        <ul class="font-montserrat items-center hidden md:flex">
          <li class="mx-3 ">
            <a class="growing-underline" href="howitworks">
              How it works
            </a>
          </li>
          <li class="growing-underline mx-3">
            <a href="features">Features</a>
          </li>
          <li class="growing-underline mx-3">
            <a href="pricing">Pricing</a>
          </li>
        </ul>
        <div class="font-montserrat hidden md:block">
          <button class="mr-6">Login</button>
          <button class="py-2 px-4 text-white bg-black rounded-3xl">
            Signup
          </button>
        </div>
        <div id="showMenu" class="md:hidden">
          <img src='dist/assets/logos/Menu.svg' alt="Menu icon" />
        </div>
      </nav>
      <div id='mobileNav' class="hidden px-4 py-6 fixed top-0 left-0 h-full w-full bg-secondary z-20 animate-fade-in-down">
        <div id="hideMenu" class="flex justify-end">
          <img src='dist/assets/logos/Cross.svg' alt="" class="h-16 w-16" />
        </div>
        <ul class="font-montserrat flex flex-col mx-8 my-24 items-center text-3xl">
          <li class="my-6">
            <a href="howitworks">How it works</a>
          </li>
          <li class="my-6">
            <a href="features">Features</a>
          </li>
          <li class="my-6">
            <a href="pricing">Pricing</a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default AppHeader;
