import { createContext, useState, useEffect } from "react"
import { FileFolderItem } from './storeItem/fileFolderItem'
import { AppHeader } from './header/header'
import { backendFetch } from './utils/fetchUtils'
import { useParams } from "react-router-dom";
import List from '@mui/material/List';
import Container from '@mui/material/Container';


export const SelectedItemContext = createContext()


export const FileSystem = () => {
    const [selectedItems, setSelectedItems] = useState([])
    const [currentPath, setcurrentPath] = useState([])

    const { itemId } = useParams();

    const currentRootItem = currentPath.length ? currentPath[currentPath.length - 1] : null

    console.log('itemId', itemId, currentRootItem?.id)

    const addSelectedItem = (item) => {
        setSelectedItems(selectedItems => [...selectedItems, item])
    }

    const dropSelectedItem = (item) => {
        setSelectedItems(selectedItems => selectedItems.filter(x => x.id != item.id))
    }

    const DropAllSelectedItems = () => {
        setSelectedItems([])
    }

    useEffect(() => {
        let ignore = false;

        const fetchFolderSubjects = async () => {
            const getItemPath = (itemId) => {
                return backendFetch({ url: `ff_item/get_path/?item_id=${itemId || ""}` })
                    .then(result => result.ok ? result.json() : {})
            }

            if ((currentRootItem == null || currentRootItem.id != itemId)) {
                console.log('itemId', itemId)
                setcurrentPath(await getItemPath(itemId))
            }
        }

        fetchFolderSubjects()
        return () => { ignore = true }
    }, [currentPath, itemId])

    return (
        <Container maxWidth="xs">
            <SelectedItemContext.Provider value={{
                selectedItems,
                addSelectedItem,
                dropSelectedItem,
                DropAllSelectedItems,
                selectedAmount: selectedItems?.length || 0,
            }}>
                <AppHeader itemPath={currentPath} />


                <List dense={false}>
                    <FileFolderItem 
                        item={currentPath.reduce((_, elem) => elem, null)} 
                        isShowDetails={true} 
                        key={currentPath.reduce((_, elem) => elem, null)?.id}
                    />
                </List>

            </SelectedItemContext.Provider>
        </Container>
    )
} 