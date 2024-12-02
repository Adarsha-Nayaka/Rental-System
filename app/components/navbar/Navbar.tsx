import { SafeUser } from "@/app/types";

import Categories from "./Categories";
import Container from "../Container";
import Logo from "./Logo";
import SearchBox from "../SearchBox";
import Search from "./Search";
import UserMenu from "./UserMenu";

interface NavbarProps {
  currentUser?: SafeUser | null;
  onSearch: (query: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onSearch,
}) => {
  return ( 
    <div className="fixed w-full bg-white z-10 shadow-md">
      <div
        className="
          py-4 
          border-b-[2px]
          shadow-sm
        "
      >
      <Container>
        <div 
          className="
            flex 
            flex-row 
            items-center 
            justify-between
            gap-3
            md:gap-0
          "
        >
          <Logo />
          <Search />
          <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end',  }}>
            <SearchBox onSearch={onSearch} /> {/* Add the SearchBox here */}
          </div>

          <UserMenu currentUser={currentUser} />
        </div>
      </Container>
    </div>
    <Categories />
  </div>
  );
}


export default Navbar;