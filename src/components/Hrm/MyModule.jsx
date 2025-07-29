import React, { useEffect } from "react";
import Home from "./Home";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import $ from "jquery";
import 'bootstrap/dist/css/bootstrap.min.css';


export default function MyModule() {
  useEffect(() => {
    // Sidebar menu links
    $('.js-navbar-vertical-aside-menu-link')
      .off('click')
      .on('click', function (e) {
        e.preventDefault();
        const $li = $(this).closest('li');
        const $submenu = $(this).next('.js-navbar-vertical-aside-submenu');
        $li.toggleClass('active');
        $submenu.slideToggle(200);
      });

    // Collapse button
    $('.js-navbar-vertical-aside-toggle-invoker')
      .off('click')
      .on('click', function (e) {
        e.preventDefault();
        $('.js-navbar-vertical-aside').toggleClass('collapsed');
      });
  }, []);

  return (
    <div style={{ backgroundColor: "lightcyan" }}>
      <ToastContainer />
      <Home />
    </div>
  );
}
