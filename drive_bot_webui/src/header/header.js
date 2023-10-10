
import { useContext, useState } from "react"
import { SelectedItemContext } from '../fileSystem.page'
import { Link } from "react-router-dom";


export const AppHeader = ({ itemPath }) => {
    return (
        <div>
            <div>
                <SelectedItem />
                {/* <ActionButton /> */}
            </div>
            <FolderPath itemPath={itemPath} />
        </div>
    )
}


const SelectedItem = () => {
    const { selectedAmount, DropAllSelectedItems } = useContext(SelectedItemContext)
    return (
        <>
            {
                selectedAmount
                    ? <span> {selectedAmount} subjects selected
                        <span onClick={() => { DropAllSelectedItems() }}>&times;</span>
                    </span >
                    : <span> <i>You can open, add and change folders. For get file just click on icon: </i></span>
            }
        </>
    )
}


// const ActionButton = () => {
//     const { selectedAmount } = useContext(SelectedItemContext)
//     return (
//         <>
//             {(selectedAmount > 0) && <button>  Send </button>}
//         </>
//     )
// }


const FolderPath = ({ itemPath }) => {

    const links = itemPath.map((ascendant, num) => <Link to={`/${ascendant.id}/`}>
        {
            num == 0 ? "Main" :
                ascendant.name ? ascendant.name.slice(0, 30) :
                    ascendant.text ? ascendant.text.name.slice(0, 30) :
                        "Unnamed"
        }
    </Link>)

    console.log("links", links)
    return (
        <div style={{ marginTop: "32px"}}>
            {links.map(elem => { return <span> {elem} /</span> })}
        </div>
    )
}