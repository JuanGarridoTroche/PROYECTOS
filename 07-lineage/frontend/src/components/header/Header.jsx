import("../../css/Header.css");
import { Brand } from "./Brand";
import { Auth } from "./Auth";

export const Header = () => {
  return (
    <header className="menu-header">
      <Brand />
      <Auth />
    </header>
  );
};
