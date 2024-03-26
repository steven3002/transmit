export default function Table({ data }: TableProps) {
    return (
        <div id="table" className="flex flex-col overflow-hidden">
            <div className="sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                    <table className="min-w-full text-left text-sm font-light text-surface dark:text-white">
                        <thead className="border-b border-neutral-200 font-medium dark:border-white/10">
                        <tr>
                            <th scope="col" className="px-6 py-4">#</th>
                            <th scope="col" className="px-6 py-4">Key</th>
                            <th scope="col" className="px-6 py-4">Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.map((item, index) => (
                            <tr
                                key={item.id}
                                className="border-b border-neutral-200 transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-white/10 dark:hover:bg-purple-100"
                            >
                                <td className="whitespace-nowrap px-6 py-4 font-medium">{index}</td>
                                <td className="whitespace-nowrap px-6 py-4">{item.id}</td>
                                <td className="whitespace-nowrap px-6 py-4">{`${item.status}`}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

type TableProps = {
    data: TableItem[]
}

type TableItem = {
    id: string;
    status: boolean;
}

export const TableSampleData: TableItem[] = Array.from({ length: 20 }, (_, index) => ({
    id: `0x${index}`,
    status: index % 2 === 0
})) as TableItem[];