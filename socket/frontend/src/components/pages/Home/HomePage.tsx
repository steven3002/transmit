import NavigationBar from "../../organisms/NavigationBar.tsx";
import Footer from "../../organisms/Footer.tsx";
import TransitForm from "../../organisms/TransitForm.tsx";
import Table, { TableSampleData } from "../../organisms/Table.tsx";

export default function HomePage() {
    return (
        <div>
            <NavigationBar />
            <TransitForm/>
            <Table data={TableSampleData} />
            <Footer />
        </div>
    );
}