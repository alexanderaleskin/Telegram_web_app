import { useState } from 'react';

import {
  Button, TextField, Dialog, ListItemIcon, DialogActions,
  DialogContent, DialogContentText, DialogTitle, MenuItem
} from "@mui/material"
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import { backendFetch } from '../../utils/fetchUtils'


export function AddFolder({ folder, setFolderSubjects, closeDropDown }) {
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
          url: `ff_item/`,
          options: {
            method: 'POST',
            body: JSON.stringify({
              parent: folder.id,
              name: itemName,
              type: "folder",
              user: folder.user,
              message_format: ""
            })
          }

        }
      )
      request.then(response => response.ok ? response.json() : null)
        .then(folder => folder ? setFolderSubjects(
          subs => subs ? [...subs, folder] : [folder]
        ) : null)

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
        <ListItemIcon><CreateNewFolderIcon /></ListItemIcon> Add
      </span>


      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add folder</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Write name of folder for creating in folder "{folder.name}"
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
          <Button onClick={handleChange}>Create</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}