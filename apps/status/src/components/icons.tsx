import { cn } from "@myy/ui/cn";
import type React from "react";

export const Icons = {
	blank: (props) => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			id="root"
			viewBox="0 0 16 16"
			fill="none"
			className={cn(
				"text-neutral-200 dark:text-statuspage-neutral-500",
				props.className,
			)}
			height="18"
			width="18"
			{...props}
		>
			<g clipPath="url(#clip0_684_12672)">
				<path
					d="M5 2.80664V2.81164"
					stroke="currentColor"
					strokeWidth="1.8"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M2.80835 5V5.005"
					stroke="currentColor"
					strokeWidth="1.8"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M2 8V8.005"
					stroke="currentColor"
					strokeWidth="1.8"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M2.80835 11V11.005"
					stroke="currentColor"
					strokeWidth="1.8"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M5 13.1934V13.1984"
					stroke="currentColor"
					strokeWidth="1.8"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M8 14V14.005"
					stroke="currentColor"
					strokeWidth="1.8"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M11 13.1934V13.1984"
					stroke="currentColor"
					strokeWidth="1.8"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M13.1917 11V11.005"
					stroke="currentColor"
					strokeWidth="1.8"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M14 8V8.005"
					stroke="currentColor"
					strokeWidth="1.8"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M13.1917 5V5.005"
					stroke="currentColor"
					strokeWidth="1.8"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M11 2.80664V2.81164"
					stroke="currentColor"
					strokeWidth="1.8"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<path
					d="M8 2V2.005"
					stroke="currentColor"
					strokeWidth="1.8"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</g>
			<defs>
				<clipPath id="clip0_684_12672">
					<rect width="16" height="16" fill="white" />
				</clipPath>
			</defs>
		</svg>
	),
	resolved: (props) => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 18 18"
			className={cn(props.className)}
			height="18"
			width="18"
			{...props}
		>
			<path
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="1.3"
				d="M10.922 7.313a9.01 9.01 0 0 0-2.57 3.852L6.75 9.563m9-.563a6.75 6.75 0 1 1-13.5 0 6.75 6.75 0 0 1 13.5 0Z"
			/>
		</svg>
	),
	info: (props) => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 20 20"
			fill="currentColor"
			className={cn("size-4 inline", props.className)}
			{...props}
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M19 10.5a8.5 8.5 0 11-17 0 8.5 8.5 0 0117 0zM8.25 9.75A.75.75 0 019 9h.253a1.75 1.75 0 011.709 2.13l-.46 2.066a.25.25 0 00.245.304H11a.75.75 0 010 1.5h-.253a1.75 1.75 0 01-1.709-2.13l.46-2.066a.25.25 0 00-.245-.304H9a.75.75 0 01-.75-.75zM10 7a1 1 0 100-2 1 1 0 000 2z"
			/>
		</svg>
	),
	warning: (props) => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			id="root"
			className={cn("text-[#F59E0B] inline -mt-[2px]", props.className)}
			viewBox="0 0 18 18"
			fill="none"
			height="16"
			width="16"
			{...props}
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M1.6875 9C1.6875 4.96125 4.96125 1.6875 9 1.6875C13.0387 1.6875 16.3125 4.96125 16.3125 9C16.3125 13.0387 13.0387 16.3125 9 16.3125C4.96125 16.3125 1.6875 13.0387 1.6875 9ZM9 6.1875C9.14918 6.1875 9.29226 6.24676 9.39775 6.35225C9.50324 6.45774 9.5625 6.60082 9.5625 6.75V9.5625C9.5625 9.71168 9.50324 9.85476 9.39775 9.96025C9.29226 10.0657 9.14918 10.125 9 10.125C8.85082 10.125 8.70774 10.0657 8.60225 9.96025C8.49676 9.85476 8.4375 9.71168 8.4375 9.5625V6.75C8.4375 6.60082 8.49676 6.45774 8.60225 6.35225C8.70774 6.24676 8.85082 6.1875 9 6.1875ZM9 12.375C9.14918 12.375 9.29226 12.3157 9.39775 12.2102C9.50324 12.1048 9.5625 11.9617 9.5625 11.8125C9.5625 11.6633 9.50324 11.5202 9.39775 11.4148C9.29226 11.3093 9.14918 11.25 9 11.25C8.85082 11.25 8.70774 11.3093 8.60225 11.4148C8.49676 11.5202 8.4375 11.6633 8.4375 11.8125C8.4375 11.9617 8.49676 12.1048 8.60225 12.2102C8.70774 12.3157 8.85082 12.375 9 12.375Z"
				fill="currentColor"
			/>
		</svg>
	),
	status: (props) => (
		<>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 40 41"
				fill="none"
				className="dark:hidden"
				height="40"
				width="40"
			>
				<circle
					cx="20"
					cy="20.5"
					r="18"
					stroke="url(#paint0_linear_372_15477)"
					strokeOpacity="0.3"
					strokeWidth="4"
				/>
				<path
					d="M27.187,16.156L27.187,16.157C23.88,19.315 21.045,22.933 18.768,26.899L18.768,26.899C18.692,27.033 18.586,27.146 18.458,27.232C18.331,27.318 18.185,27.373 18.033,27.393C17.88,27.413 17.726,27.398 17.58,27.349C17.434,27.299 17.302,27.217 17.194,27.109L12.794,22.706L12.787,22.7L12.781,22.694C12.683,22.603 12.604,22.492 12.549,22.37C12.495,22.247 12.465,22.115 12.463,21.98C12.46,21.846 12.485,21.713 12.535,21.588C12.586,21.464 12.661,21.35 12.756,21.256C12.85,21.161 12.964,21.086 13.088,21.035C13.213,20.985 13.346,20.96 13.48,20.963C13.615,20.965 13.747,20.994 13.87,21.049C13.992,21.104 14.103,21.183 14.194,21.281L14.2,21.287L14.207,21.294L17.251,24.336L17.694,24.779L18.028,24.248C20.215,20.758 22.828,17.555 25.805,14.71C25.9,14.619 26.012,14.548 26.135,14.5C26.257,14.453 26.388,14.43 26.519,14.433C26.65,14.436 26.78,14.465 26.9,14.518C27.02,14.571 27.129,14.647 27.219,14.742C27.31,14.837 27.381,14.949 27.429,15.072C27.476,15.194 27.499,15.325 27.496,15.456C27.493,15.587 27.464,15.717 27.411,15.837C27.358,15.957 27.282,16.066 27.187,16.156ZM20,37C24.376,37 28.573,35.262 31.667,32.167C34.762,29.073 36.5,24.876 36.5,20.5C36.5,16.124 34.762,11.927 31.667,8.833C28.573,5.738 24.376,4 20,4C15.624,4 11.427,5.738 8.333,8.833C5.238,11.927 3.5,16.124 3.5,20.5C3.5,24.876 5.238,29.073 8.333,32.167C11.427,35.262 15.624,37 20,37Z"
					strokeWidth="1"
					strokeLinejoin="bevel"
					fill="#059669"
					stroke="white"
				/>
				<circle
					cx="20"
					cy="20.5"
					r="15.5"
					className="animate-pulse"
					stroke="url(#paint1_linear_372_15477)"
					strokeOpacity="0.3"
				/>
				<defs>
					<linearGradient
						id="paint0_linear_372_15477"
						x1="-52.0569"
						y1="-87.8493"
						x2="40.5249"
						y2="45.237"
						gradientUnits="userSpaceOnUse"
					>
						<stop offset="0.63328" stopColor="#059669" />
						<stop offset="1" stopColor="#059669" stopOpacity="0" />
					</linearGradient>
					<linearGradient
						id="paint1_linear_372_15477"
						x1="12.1082"
						y1="0.237206"
						x2="43.0515"
						y2="46.6521"
						gradientUnits="userSpaceOnUse"
					>
						<stop stopColor="#0D0F14" />
						<stop offset="1" stopColor="#0D0F14" />
					</linearGradient>
				</defs>
			</svg>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 40 41"
				fill="none"
				className="hidden dark:block"
				height="40"
				width="40"
			>
				<path
					d="M27.187,16.156L27.187,16.157C23.88,19.315 21.045,22.933 18.768,26.899L18.768,26.899C18.692,27.033 18.586,27.146 18.458,27.232C18.331,27.318 18.185,27.373 18.033,27.393C17.88,27.413 17.726,27.398 17.58,27.349C17.434,27.299 17.302,27.217 17.194,27.109L12.794,22.706L12.787,22.7L12.781,22.694C12.683,22.603 12.604,22.492 12.549,22.37C12.495,22.247 12.465,22.115 12.463,21.98C12.46,21.846 12.485,21.713 12.535,21.588C12.586,21.464 12.661,21.35 12.756,21.256C12.85,21.161 12.964,21.086 13.088,21.035C13.213,20.985 13.346,20.96 13.48,20.963C13.615,20.965 13.747,20.994 13.87,21.049C13.992,21.104 14.103,21.183 14.194,21.281L14.2,21.287L14.207,21.294L17.251,24.336L17.694,24.779L18.028,24.248C20.215,20.758 22.828,17.555 25.805,14.71C25.9,14.619 26.012,14.548 26.135,14.5C26.257,14.453 26.388,14.43 26.519,14.433C26.65,14.436 26.78,14.465 26.9,14.518C27.02,14.571 27.129,14.647 27.219,14.742C27.31,14.837 27.381,14.949 27.429,15.072C27.476,15.194 27.499,15.325 27.496,15.456C27.493,15.587 27.464,15.717 27.411,15.837C27.358,15.957 27.282,16.066 27.187,16.156ZM20,37C24.376,37 28.573,35.262 31.667,32.167C34.762,29.073 36.5,24.876 36.5,20.5C36.5,16.124 34.762,11.927 31.667,8.833C28.573,5.738 24.376,4 20,4C15.624,4 11.427,5.738 8.333,8.833C5.238,11.927 3.5,16.124 3.5,20.5C3.5,24.876 5.238,29.073 8.333,32.167C11.427,35.262 15.624,37 20,37Z"
					strokeWidth="1"
					strokeLinejoin="bevel"
					fill="#10B981"
					stroke="black"
				/>
				<circle
					cx="20"
					cy="20.5"
					r="15.5"
					stroke="url(#paint0_linear_343_10907)"
					strokeOpacity="0.3"
				/>
				<circle
					cx="20"
					cy="20.5"
					r="18"
					className="animate-pulse"
					stroke="url(#paint1_linear_343_10907)"
					strokeOpacity="0.3"
					strokeWidth="4"
				/>
				<defs>
					<linearGradient
						id="paint0_linear_343_10907"
						x1="12.1082"
						y1="0.237206"
						x2="43.0515"
						y2="46.6521"
						gradientUnits="userSpaceOnUse"
					>
						<stop stopColor="white" />
						<stop offset="1" stopColor="white" stopOpacity="0" />
					</linearGradient>
					<linearGradient
						id="paint1_linear_343_10907"
						x1="-52.0569"
						y1="-87.8493"
						x2="40.5249"
						y2="45.237"
						gradientUnits="userSpaceOnUse"
					>
						<stop offset="0.63328" stopColor="#10B981" />
						<stop offset="1" stopColor="#10B981" stopOpacity="0" />
					</linearGradient>
				</defs>
			</svg>
		</>
	),
	maintenance: (props) => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			id="root"
			viewBox="0 0 16 16"
			fill="none"
			className={cn("inline", props.className)}
			height="16"
			width="16"
			{...props}
		>
			<g clipPath="url(#clip0_371_60640)">
				<path
					d="M4.66673 6.66624H6.66673V4.66624L4.3334 2.33291C5.07982 1.97643 5.9184 1.86011 6.73366 1.99999C7.54893 2.13987 8.30078 2.52906 8.88568 3.11396C9.47059 3.69886 9.85977 4.45071 9.99965 5.26598C10.1395 6.08124 10.0232 6.91982 9.66673 7.66624L13.6667 11.6662C13.9319 11.9315 14.0809 12.2912 14.0809 12.6662C14.0809 13.0413 13.9319 13.401 13.6667 13.6662C13.4015 13.9315 13.0418 14.0805 12.6667 14.0805C12.2917 14.0805 11.9319 13.9315 11.6667 13.6662L7.66673 9.66624C6.92031 10.0227 6.08173 10.139 5.26647 9.99916C4.4512 9.85928 3.69935 9.4701 3.11445 8.8852C2.52954 8.30029 2.14036 7.54844 2.00048 6.73318C1.8606 5.91791 1.97691 5.07933 2.3334 4.33291L4.66673 6.66624Z"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</g>
			<defs>
				<clipPath id="clip0_371_60640">
					<rect width="16" height="16" fill="white" />
				</clipPath>
			</defs>
		</svg>
	),
} satisfies Record<string, React.ElementType<React.SVGProps<SVGSVGElement>>>;
