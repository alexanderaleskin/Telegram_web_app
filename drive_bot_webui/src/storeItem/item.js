import { useContext, useState } from "react"
import { SelectedItemContext } from '../fileSystem.page'
import { Link } from "react-router-dom";


export const ItemRow = ({ item }) => {
    // const [isSelected, setIsSelected] = useState(false)

    const itemName = item.name ? item.name : item.datetime_change

    const { selectedItems, addSelectedItem, dropSelectedItem} = useContext(SelectedItemContext)
    const isSelected = !!selectedItems.find(x => x.id === item.id)

    const ChangeSelection = () => {
        if (isSelected) dropSelectedItem(item)
        else addSelectedItem(item)
    }

    return (
        <Link to={`/${item.id}/`} >
            {/* <input type="checkbox" value={isSelected} onChange={(e) => {ChangeSelection()}}/> */}
            { itemName?.length > 20 ? `${itemName.slice(0, 20)}...` : itemName}
        </Link>
    )
}