import { useState, useEffect } from "react"
import { ItemRow } from "./item"
import { FolderSubjects } from "./folderSubjects"
import { backendFetch } from '../utils/fetchUtils'
import { DropDownMenu } from '../components/dropdown'

import { ChangeName } from './actions/changeName'
import { AddFolder } from './actions/addFolder'
import { DeleteItem } from './actions/deleteItem'
import { ChangeParent } from './actions/changeParent'

import { Button, MenuItem, ListItem, ListItemIcon, Collapse } from "@mui/material"
import FolderIcon from '@mui/icons-material/Folder';



export const Folder = ({ folder, isShowDetails = false }) => {
    const [isShowSubItems, setIsShowSubItems] = useState(isShowDetails)
    const [folderSubjects, setFolderSubjects] = useState(null)

    const folderId = folder?.id ? folder.id : ''

    useEffect(() => {
        let ignore = false;

        const fetchFolderSubjects = async () => {
            const getFolderSubs = (reqFolderId) => {
                return backendFetch({ url: `ff_item/?parent_id=${reqFolderId}` })
                    .then(result => result.ok ? result.json() : {})
            }

            if ((folderSubjects == null) && isShowSubItems && !ignore) {
                const folderSubjectsData = await getFolderSubs(folder.id)
                setFolderSubjects(folderSubjectsData)
            }
        }

        fetchFolderSubjects()
        return () => { ignore = true }
    }, [isShowSubItems, folderSubjects, folderId])

    const [anchorEl, setAnchorEl] = useState(null);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <ListItem secondaryAction={
                <>
                    <DropDownMenu
                        itemId={folder?.id}
                        menuName={"..."}
                        anchorEl={anchorEl}
                        handleClick={handleClick}
                        handleClose={handleClose}
                    >
                        <MenuItem> <AddFolder folder={folder} setFolderSubjects={setFolderSubjects} closeDropDown={handleClose} /></MenuItem>
                        <MenuItem> <ChangeName item={folder} setFolderSubjects={setFolderSubjects} closeDropDown={handleClose} /></MenuItem>
                        <MenuItem> <DeleteItem item={folder}  closeDropDown={handleClose} /></MenuItem>
                        <MenuItem> <ChangeParent item={folder} closeDropDown={handleClose} /></MenuItem>
                    </DropDownMenu>

                    {!isShowDetails && (
                        <Button
                            variant="text"
                            onClick={(e) => setIsShowSubItems(!isShowSubItems)}
                        >
                            {isShowSubItems ? '-' : '+'}
                        </Button>
                    )}
                </>
            }>

                <ListItemIcon style={{ minWidth: "32px" }}><FolderIcon /></ListItemIcon>
                <ItemRow item={folder} />
                {/* <ChangeName item={folder} /> */}
            </ListItem >

            <Collapse in={isShowSubItems} timeout="auto" unmountOnExit>
                {isShowSubItems && folderSubjects && folderSubjects.length >= 0 && <FolderSubjects folderSubjects={folderSubjects} />}
            </Collapse>
        </>
    )
}