
import { useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import { ChangeName } from '../storeItem/actions/changeName'


export function DropDownMenu({ itemId, menuName, anchorEl, handleClick, handleClose,  children }) {
  const open = Boolean(anchorEl);
  return (
    <>
      <Button
        variant="text"
        id={ `basic-button-${itemId}`}
        aria-controls={open ? `basic-menu-${itemId}` : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        {menuName}
      </Button>
      <Menu
        id={`basic-menu-${itemId}`}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': `basic-button-${itemId}`,
        }}
      >
        {/* <div onClick={handleClose}> */}
        {children}
        {/* </div> */}

      </Menu>
    </>
  );
}