import { useState } from 'react';

import {
  Button, TextField, Dialog, ListItemIcon, DialogActions,
  DialogContent, DialogContentText, DialogTitle, MenuItem
} from "@mui/material"
import EditIcon from '@mui/icons-material/Edit';
import { backendFetch } from '../../utils/fetchUtils'


export function ChangeName({ item, closeDropDown }) {
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');

  const handleClickOpen = () => {

    setOpen(true)
  };

  const handleClose = () => {

    closeDropDown()
    setOpen(false);
  };


  const handleChange = () => {
    if (itemName) {
      const request = backendFetch(
        {
          url: `ff_item/${item.id}/`,
          options: {
            method: 'PUT',
            body: JSON.stringify({
              ...item,
              name: itemName,
            })
          }

        }
      )
      request.then(res => res.ok ? window.location.reload(false) : null)


    }

    closeDropDown()
    setOpen(false);
  };

  const updateItemName = (e) => {
    setItemName(e.target.value)
  }

  return (
    <>
      <span onClick={handleClickOpen}>
        <ListItemIcon><EditIcon /></ListItemIcon> &#8203;Change name
      </span>


      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Change name</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Write new name for "{item.name}"
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
            value={itemName}
            onChange={updateItemName}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleChange}>Change</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}