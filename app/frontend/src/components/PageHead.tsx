import { useLayoutEffect } from "react";

interface PageHeadProps {
    title: string;
    description: string;
}

const PageHead: React.FC<PageHeadProps> = ({ title, description }) => {
    useLayoutEffect(() => {
        document.title = `${title} | QuickBytes`;
        document.querySelector('meta[name="description"]')?.setAttribute("content", description);
    }, [title, description])

    return <></>
}

export default PageHead;