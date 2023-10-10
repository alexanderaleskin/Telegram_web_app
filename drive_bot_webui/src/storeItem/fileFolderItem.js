import { Folder } from "./folder"
import { File } from "./file"


export const FileFolderItem = ({ item, isShowDetails = false }) => {
    return (
        <>
            {
                item
                    ? item.type === 'folder'
                        ? <Folder folder={item} isShowDetails={isShowDetails} />
                        : <File file={item} />
                    : <span> ... </span>
            }
        </>
    )
}