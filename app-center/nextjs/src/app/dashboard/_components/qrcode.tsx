"use client";

import { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";

export default function QrCodeComponent({ data }: { data: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const svgContainerRef = useRef<any>();

  // const downloadSvg = () => {
  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  //   const svgElement = svgContainerRef.current.querySelector("svg");
  //   const serializer = new XMLSerializer();
  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  //   const source = serializer.serializeToString(svgElement);
  //   const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
  //   const url = URL.createObjectURL(blob);
  //   const link = document.createElement("a");
  //   link.href = url;
  //   link.download = "qrcode.svg";
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  //   URL.revokeObjectURL(url);
  // };

  return (
    <div
      ref={svgContainerRef}
      className="flex h-[80vh] w-full flex-col items-center justify-center gap-3"
    >
      <h3 className="text-center text-2xl">Thank you for reviewing us!</h3>
      <QRCodeSVG
        bgColor={"transparent"}
        className="size-80"
        value={data}
        size={512}
        fgColor={"#000000"}
        level={"M"}
        includeMargin={false}
        imageSettings={{
          src: "/website/furclub-logo-icon-qr-code.svg",
          x: undefined,
          y: undefined,
          height: 100,
          width: 100,
          excavate: false,
        }}
      />
      <span className="w-80 break-words">{data}</span>
      {/* <Button className="w-80 md:w-80" onClick={downloadSvg}>
        Download
      </Button> */}
    </div>
  );
}
