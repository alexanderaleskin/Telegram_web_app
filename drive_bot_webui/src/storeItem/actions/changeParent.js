import { useState, useEffect } from 'react';

import {
  Button, TextField, Dialog, ListItemIcon, DialogActions,
  DialogContent, DialogContentText, DialogTitle, MenuItem,
  FormControl, InputLabel, Select, Box
} from "@mui/material"
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';
import { backendFetch } from '../../utils/fetchUtils'


export function ChangeParent({ item, closeDropDown, setFolderSubjects }) {
  const [open, setOpen] = useState(false);
  const [parentFolderId, setParentFolderId] = useState(null);
  const [folders, setFolders] = useState([]);

  const handleClickOpen = () => {

    setOpen(true)
  };

  const handleClose = () => {

    closeDropDown()
    setOpen(false);
  };

  useEffect(() => {
    let ignore = false;

    const fetchFolderSubjects = async () => {
      const getFolderSubs = () => {
        return backendFetch({ url: `ff_item/?type=folder` })
          .then(result => result.ok ? result.json() : {})
      }

      if (!ignore) {
        const folders = await getFolderSubs()
        setFolders(folders.filter(folder => folder.id != item.id))
      }
    }

    fetchFolderSubjects()
    return () => { ignore = true }
  }, [])


  const handleChange = () => {
    if (parentFolderId) {
      const request = backendFetch(
        {
          url: `ff_item/${item.id}/`,
          options: {
            method: 'PUT',
            body: JSON.stringify({
              ...item,
              parent: parentFolderId,
            })
          }

        }
      )

      // todo: need to reload page
      request.then(res => res.ok ? window.location.reload(false): null)
    }

    closeDropDown()
    setOpen(false);
  };

  const updateFolderId = (e) => {
    setParentFolderId(e.target.value)
  }

  return (
    <>
      <span onClick={handleClickOpen}>
        <ListItemIcon><DriveFileMoveIcon /></ListItemIcon> &#8203;Change path
      </span>


      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Change name</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Select new parent folder for "{item.name}":
          </DialogContentText>

          <Box
            noValidate
            component="form"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              m: 'auto',
              width: 'fit-content',
            }}
          >
            <FormControl sx={{ mt: 2, minWidth: 120 }}>
              <InputLabel htmlFor="max-width">new Folder</InputLabel>
              <Select
                autoFocus
                value={parentFolderId}
                onChange={updateFolderId}
                label="new-folder"
                inputProps={{
                  name: 'max-width',
                  id: 'max-width',
                }}
              >

                {
                  folders.map(folder => <MenuItem value={folder.id}>{folder.name} {folder.id}</MenuItem>)
                }
              </Select>
            </FormControl>
          </Box>



        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleChange}>Change</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}