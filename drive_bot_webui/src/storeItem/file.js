import { useState } from "react"
import { ItemRow } from "./item"
import { DropDownMenu } from '../utils/dropdown'

import { ChangeName } from './actions/changeName'
import { DeleteItem } from './actions/deleteItem'
import { ChangeParent } from './actions/changeParent'

import { Button, MenuItem, ListItem, ListItemIcon, Collapse } from "@mui/material"

import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import SendIcon from '@mui/icons-material/Send';
import { telegramBotUsername } from "../config"
// import ShareIcon from '@mui/icons-material/Share';



export const File = ({ file }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <ListItem secondaryAction={
            <>
                <DropDownMenu
                    itemId={file?.id}
                    menuName={"..."}
                    anchorEl={anchorEl}
                    handleClick={handleClick}
                    handleClose={handleClose}
                >
                    <MenuItem> <ChangeName item={file} closeDropDown={handleClose} /></MenuItem>
                    <MenuItem> <DeleteItem item={file} closeDropDown={handleClose} /></MenuItem>
                    <MenuItem> <ChangeParent item={file} closeDropDown={handleClose} /></MenuItem>
                </DropDownMenu>

                <Button
                    variant="text"
                    onClick={(e) => { window.Telegram.WebApp.openTelegramLink(`https://t.me/${telegramBotUsername}/?start=${file?.id}`) }}
                >
                    <SendIcon />
                </Button>
            </>
        }>
            <ListItemIcon style={{ minWidth: "32px" }}><InsertDriveFileIcon /></ListItemIcon>
            <ItemRow item={file} /> {' '}
        </ListItem>
    )
}