import {
  BsGrid1X2Fill
} from "react-icons/bs";
import {BiLogOut} from "react-icons/bi";
import PropTypes from "prop-types";

function Sidebar({ openSidebarToggle, OpenSidebar }) {
  const logout = () => {
    console.log('Logout clicked');
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  };
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <aside
      id="sidebar"
      className={openSidebarToggle ? "sidebar-responsive" : ""}
    >
      <div className="sidebar-title">
        <div className="sidebar-brand">
        <BsGrid1X2Fill className="icon" /> Dushbins
        </div>
        <span className="icon close_icon" onClick={OpenSidebar}>
          X
        </span>
      </div>

      <div className="sidebar-user">
        <span className="user-name">
          {user ? user.username : ""}
        </span>
        <span className="user-email">
          {user ? user.email : ""}
        </span>
      </div>

      <ul className="sidebar-list">
        <li className="sidebar-list-item">
          <a onClick={logout}>
            <BiLogOut className="icon" /> Logout
          </a>
        </li>
      </ul>
    </aside>
  );
}

Sidebar.propTypes = {
  openSidebarToggle: PropTypes.bool,
  OpenSidebar: PropTypes.func,
};

export default Sidebar;
