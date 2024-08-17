import Image from "next/image";

const Loading = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-10">
      <Image src={"/logo.svg"} alt="Loading..." width={500} height={500} />
      <h1 className="text-4xl font-medium tracking-widest text-center">
        Loading
      </h1>
    </div>
  );
};

export default Loading;
