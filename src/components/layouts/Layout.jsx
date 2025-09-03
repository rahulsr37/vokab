import React from "react";

const Layout = (props) => {
  const { children } = props;
  return (
    <>
      <header>
        <h1 className="text-gradient">Vokab</h1>
      </header>
      <main>{children}</main>
      <footer>
        <small>Created by</small>
        <a target="_blank" href="https://www.instagram.com/rahulsr__/">
          <p>@rahulsr</p>
          <i className="fa-brands fa-instagram"></i>
        </a>
      </footer>
    </>
  );
};

export default Layout;
