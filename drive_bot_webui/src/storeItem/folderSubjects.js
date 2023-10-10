import { useState } from "react"
import { FileFolderItem } from "./fileFolderItem"


export const FolderSubjects = ({ folderSubjects }) => {
    return <div style={{ marginLeft: 16 }}>

        {folderSubjects.map(folderSub =>
            <FileFolderItem item={folderSub} key={`${folderSub.id}`} />
        )}

    </div>
}