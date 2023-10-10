import { useContext, useState } from "react"
import { SelectedItemContext } from '../fileSystem.page'
import { Link } from "react-router-dom";


export const ItemRow = ({ item }) => {
    // const [isSelected, setIsSelected] = useState(false)

    const itemName =
        item.name ? item.name 
                  : item.text 
                  ? item.text
                  : `Unnamed, 🕐 ${ item.datetime_change.replace('T', ' ') }`

    const { selectedItems, addSelectedItem, dropSelectedItem } = useContext(SelectedItemContext)
    const isSelected = !!selectedItems.find(x => x.id === item.id)

    const ChangeSelection = () => {
        if (isSelected) dropSelectedItem(item)
        else addSelectedItem(item)
    }

    return (
        <Link to={`/${item.id}/`} style={{ maxWidth: "60%" }}>
            {/* <input type="checkbox" value={isSelected} onChange={(e) => {ChangeSelection()}}/> */}
            {itemName?.length > 28 ? `${itemName.slice(0, 28)}...` : itemName}
        </Link>
    )
}