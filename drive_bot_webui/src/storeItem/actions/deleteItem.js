import { useState } from 'react';

import {
  Button, TextField, Dialog, ListItemIcon, DialogActions,
  DialogContent, DialogContentText, DialogTitle, MenuItem
} from "@mui/material"
import { backendFetch } from '../../utils/fetchUtils'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';


export function DeleteItem({ item, closeDropDown, setFolderSubjects }) {
  const [open, setOpen] = useState(false);
  // const [itemName, setItemName] = useState('');

  const handleClickOpen = () => {
    
    setOpen(true)
  };

  const handleClose = () => {

    closeDropDown()
    setOpen(false);
  };


  const handleChange = () => {

      const request = backendFetch(
        {
          url: `ff_item/${item.id}/`,
          options: {
            method: 'DELETE',
          }

        }
      )
      
      // todo: need to reload page
      

    closeDropDown()
    setOpen(false);
  };

  return (
    <>
      <span onClick={handleClickOpen}>
      <ListItemIcon><DeleteForeverIcon /></ListItemIcon> Delete
      </span>
      
      
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Delete "{item.name}" ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleChange}>Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}