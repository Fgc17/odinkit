import clsx from "clsx";

export function SevenDaysMoneyBackIcon({ className }: { className?: string }) {
  return (
    <div className={clsx("relative", className)}>
      <svg
        viewBox="0 0 448 347"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full"
      >
        <path
          d="M41.5769 245.82L7 221.803C7 221.803 22.6975 219.283 51.5469 218.769C80.3964 218.255 89.5179 221.803 89.5179 221.803L137.247 274.774C137.247 274.774 108.079 267.42 72.5476 267.523C37.0162 267.626 7 274.774 7 274.774L41.5769 245.82Z"
          fill="#075e54"
          stroke="black"
          strokeWidth="5"
        ></path>{" "}
        <path
          d="M406.013 245.871L440.59 221.854C440.59 221.854 424.893 219.334 396.043 218.82C367.194 218.306 358.072 221.854 358.072 221.854L310.343 274.825C310.343 274.825 339.511 267.471 375.042 267.574C410.574 267.677 440.59 274.825 440.59 274.825L406.013 245.871Z"
          fill="#075e54"
          stroke="black"
          strokeWidth="5"
        ></path>{" "}
        <path
          d="M377.158 236.412L409.826 213.029V195.681H377.158V236.412Z"
          fill="#075e54"
          stroke="black"
          strokeWidth="5"
        ></path>{" "}
        <path
          d="M74.2729 236.412L41.6052 213.029V195.681H74.2729V236.412Z"
          fill="#075e54"
          stroke="black"
          strokeWidth="5"
        ></path>{" "}
        <path
          d="M69.5249 116.247L69.5249 231.459C69.5249 249.488 79.2315 266.122 94.9287 274.991L198.39 333.448C213.257 341.848 231.384 342.08 246.462 334.062L358.011 274.742C374.334 266.062 384.535 249.083 384.535 230.596L384.535 117.112C384.535 98.7046 374.421 81.7857 358.207 73.0708L246.663 13.1179C231.48 4.95724 213.165 5.19259 198.196 13.7407L94.7294 72.8282C79.1442 81.7285 69.5249 98.2993 69.5249 116.247Z"
          fill="white"
          stroke="black"
          strokeWidth="5"
        ></path>{" "}
        <path
          d="M86.9724 125.016L86.9724 221.769C86.9724 239.799 96.6794 256.432 112.377 265.302L199.587 314.575C214.455 322.975 232.581 323.206 247.658 315.189L341.942 265.053C358.265 256.373 368.467 239.394 368.467 220.906L368.467 125.881C368.467 107.473 358.352 90.5537 342.138 81.839L247.86 31.1682C232.677 23.0081 214.362 23.2435 199.394 31.791L112.178 81.5963C96.5921 90.4966 86.9724 107.068 86.9724 125.016Z"
          stroke="#075e54"
          strokeWidth="5"
        ></path>{" "}
        <path
          d="M71.0628 205.843H382.891V224.357C382.891 224.357 291.358 217.26 223.689 217.26C156.021 217.26 71.0627 224.357 71.0627 224.357L71.0628 205.843Z"
          fill="black"
          fillOpacity="0.2"
        ></path>{" "}
        <mask id="path-8-inside-1" fill="white">
          <path d="M35.001 113.016H418.953L410.892 214.02C410.892 214.02 307.48 208.929 227.083 208.929C146.687 208.929 40.4102 214.02 40.4102 214.02L35.001 113.016Z"></path>
        </mask>{" "}
        <path
          d="M35.001 113.016H418.953L410.892 214.02C410.892 214.02 307.48 208.929 227.083 208.929C146.687 208.929 40.4102 214.02 40.4102 214.02L35.001 113.016Z"
          fill="#075e54"
          stroke="black"
          strokeWidth="10"
          mask="url(#path-8-inside-1)"
        ></path>{" "}
        <text
          transform="translate(225 100)"
          id="guarantee-seal"
          fontSize="55"
          fontWeight="bold"
          fill="black"
        >
          <tspan textAnchor="middle">7</tspan>
        </text>{" "}
        <text
          transform="translate(225 185)"
          id="title-seal"
          fontSize="65"
          fontWeight="bold"
          fill="#FFF"
        >
          <tspan textAnchor="middle">DIAS</tspan>
        </text>{" "}
        <text
          transform="translate(223 255)"
          id="subtitle-seal"
          fontSize="20"
          fontWeight="bold"
          fill="black"
        >
          <tspan textAnchor="middle">DE GARANTIA</tspan>
        </text>
      </svg>
    </div>
  );
}
