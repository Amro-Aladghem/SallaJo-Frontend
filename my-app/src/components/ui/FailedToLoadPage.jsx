
export default function FailedToLoadPage()
{
    return (
        <div className="w-[100%] flex flex-col gap-4 items-center justify-center mt-4">
            <img src="/Failed.png" width={"200px"} height={"200px"}  alt="FailedToLoade"/>
            <span className="text-lg font-bold bg-primary p-2 border-secondary border-3 rounded-xl">Failed To Load Page, Server Error Please Reffresh Page!</span>
        </div>
    )
}