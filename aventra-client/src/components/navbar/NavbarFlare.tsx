export const NavbarFlare = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-[400px] pointer-events-none">
      <div
        className="absolute top-0 left-[15%] w-[500px] h-[500px] 
                   bg-primary/5 rounded-full blur-[120px] opacity-70 
                   animate-pulse"
        style={{ animationDuration: '15s' }}
      ></div>
      <div
        className="absolute top-0 right-[15%] w-[500px] h-[500px] 
                   bg-blue-500/5 rounded-full blur-[120px] opacity-70 
                   animate-pulse"
        style={{ animationDuration: '25s', animationDelay: '5s' }}
      ></div>
      <div
        className="absolute -top-[100px] left-[40%] w-[400px] h-[400px] 
                   bg-purple-500/5 rounded-full blur-[100px] opacity-60 
                   animate-pulse"
        style={{ animationDuration: '20s', animationDelay: '2s' }}
      ></div>
    </div>
  </div>
);

export default NavbarFlare;