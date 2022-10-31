import {
    ColumnDef, createColumnHelper,
    flexRender,
    getCoreRowModel,
    getSortedRowModel, SortingState,
    useReactTable
} from "@tanstack/react-table";
import React, {useState, useMemo, useEffect} from "react";
import {LinkData} from "../types";
import MenuPopup from "./MenuPopup";
import {toast} from "react-toastify";
import QrCodePopup from "./QrCodePopup";

const columnHelper = createColumnHelper<LinkData>()

export default function Table({
                                  links,
                                  userid,
                                  setEditing,
                                  editing,
                                  entry
                              }: { links: LinkData[], userid: string | undefined, setEditing: React.Dispatch<React.SetStateAction<boolean>>, editing: boolean, entry: React.Dispatch<React.SetStateAction<LinkData>> }) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [editIndex, setEditIndex] = useState<number>(-1);

    useEffect(() => {
        if (editIndex !== -1) {
            entry(links[editIndex])
        }
    }, [editIndex, entry, links])

    const columns = useMemo<ColumnDef<LinkData, any>[]>(
        () => [
            columnHelper.display({
                id: "settings",
                size: 50,
                cell: props => <MenuPopup userid={userid}
                                          element={`${props.row.getVisibleCells()[1].getValue() ?? ""}`}
                                          setEditing={setEditing}
                                          setEditIndex={setEditIndex}
                                          editing={editing}
                                          index={props.row.index}/>
            }),
            columnHelper.accessor("short", {
                header: "Short",
                size: 98,
                cell: info => <span className={"max-w-[98] w-[98px]"}>{info.getValue()}</span>,
            }),
            columnHelper.accessor("long", {
                header: "Original",
                id: "long",
                size: 150,
                cell: info => <span className={"max-w-[150px] w-[150px]"}>{info.getValue()}</span>,
            }),
            columnHelper.accessor("desc", {
                header: "Description",
                id: "desc",
                size: 218,
                cell: info => <span className={"max-w-[218px] w-[218px]"}>{info.getValue()}</span>,
            }),
            columnHelper.display({
                header: "QR Code",
                id: "qr",
                size: 98,
                cell: props =>
                    <QrCodePopup url={`${window.location.href}${props.row.getVisibleCells()[1].getValue()}`}
                                 id={`${props.row.getVisibleCells()[1].getValue()}`}/>
            }),
            columnHelper.display({
                header: "URL",
                id: "copy",
                size: 98,
                cell: props =>
                    <button
                        className={"max-w-[98px] w-[70px] border mx-2 rounded border-[2px] border-blue-400 text-blue-500 text-sm font-semibold"}
                        onClick={() => {
                            navigator.clipboard.writeText(`${window.location.href}${props.row.getVisibleCells()[1].getValue()}`)
                                .then(() => toast.success("Link was copied from to your clipboard!"))
                                .catch(() => toast.error("An error occurred while attempting to copy link."))
                        }}
                    >
                        COPY
                    </button>
            })
        ], [userid, setEditing, editing])

    const table = useReactTable({
        data: links,
        columns: columns,
        state: {sorting},
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel()
    })

    if (links.length === 0) {
        return <p className={"text-center"}>No links, fill out the form to get started!</p>
    }

    return (
        <div className="overflow-x-scroll rounded hide-scrollbar w-[101%]">
            <table className={"min-w-max"}>
                <thead className={"bg-gray-200"}>
                {table.getHeaderGroups().map(headerGroup => (
                    <tr
                        key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                            <th key={header.id} colSpan={header.colSpan}
                                className={`${header.id === "qr" || header.id === "copy" ? "text-center" : "text-left"}`}>
                                {header.isPlaceholder ? null : (
                                    <div
                                        className={`my-3 ${header.column.getCanSort() ? "cursor-pointer select-none" : ""} w-[${header.getSize()}px]`}
                                        onClick={header.column.getToggleSortingHandler()}>
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                        {{
                                            asc: '⬆',
                                            desc: '⬇',
                                        }[header.column.getIsSorted() as string] ?? null}
                                    </div>
                                )}
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody>
                {table.getRowModel().rows.map(row => (
                    <tr key={row.id}
                        className={"odd:bg-white even:bg-gray-100"}>
                        {row.getVisibleCells().map(cell => (
                            <td key={cell.id}
                                className={`text-left px-2
                                ${(cell.column.id === "desc" || cell.column.id === "long") ? "overflow-hidden overflow-x-scroll hide-scrollbar" : ""}
                                 max-w-[${cell.column.getSize()}px]`}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )


}

