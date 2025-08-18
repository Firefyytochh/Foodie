import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import Link from "next/link"
export default function LoginPage() {
    return (
        <div className="min-h-screen relative overflow-hidden">

            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-black/20" />
            </div>


            <div className="absolute top-6 right-6 z-10">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-2xl font-medium text-lg shadow-lg">
                    Admin
                </Button>
            </div>


            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">

                <div className="text-center mb-8">

                    <div className="mb-6">
                        <div className="inline-block relative">

                            <div className="w-24 h-24 mx-auto mb-2 relative">
                                <div className="w-full h-full bg-white rounded-full flex items-center justify-center relative">
                                    <Image
                                        src="/logo.png"
                                        alt="Foodie Logo"
                                        width={500}
                                        height={500}
                                        className="rounded-full"
                                    />
                                </div>
                            </div>


                            <div className="text-center">
                                <h1 className="text-4xl font-bold text-red-600 mb-1" style={{ fontFamily: "serif" }}>
                                    Foodie
                                </h1>
                                <p className="text-xs text-gray-700 font-medium tracking-wider">MADE BY FOOD LOVER</p>
                            </div>
                        </div>
                    </div>


                    <h2 className="text-5xl font-bold text-gray-800 mb-2" style={{ fontFamily: "serif", fontStyle: "italic" }}>
                        Welcome to Foodie
                    </h2>
                    <p className="text-lg text-gray-700 font-medium">Made By Food Lover For Food Lover</p>
                </div>


                <div className="w-full max-w-md space-y-4">

                    <div>
                        <Input
                            type="email"
                            placeholder="Email or username..."
                            className="w-full px-6 py-4 text-lg bg-white/90 backdrop-blur-sm border-0 rounded-full shadow-lg placeholder:text-gray-500 focus:ring-2 focus:ring-orange-400 transition-transform duration-200 hover:scale-105"
                        />
                    </div>
                    <div>
                        <Button className="w-25 bg-orange-500 hover:bg-orange-600 text-white py-4 text-lg font-semibold rounded-full shadow-lg transition-all duration-200 hover:shadow-xl align-left transition-transform duration-200 hover:scale-105">
                            Send code
                        </Button>

                    </div>
                    <div>
                        <Input
                            type="password"
                            placeholder="Enter Verification Code..."
                            className="w-full px-6 py-4 text-lg bg-white/90 backdrop-blur-sm border-0 rounded-full shadow-lg placeholder:text-gray-500 focus:ring-2 focus:ring-orange-400 transition-transform duration-200 hover:scale-105"
                        />
                    </div>

                    <div>
                        <Input
                            type="password"
                            placeholder="Enter New password"
                            className="w-full px-6 py-4 text-lg bg-white/90 backdrop-blur-sm border-0 rounded-full shadow-lg placeholder:text-gray-500 focus:ring-2 focus:ring-orange-400 transition-transform duration-200 hover:scale-105"
                        />
                    </div>
                    <div className="pt-4">

                        <Link href="/login">
                            <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 text-lg font-semibold rounded-full shadow-lg transition-all duration-200 hover:shadow-xl transition-transform duration-200 hover:scale-105">
                                Done
                            </Button>
                        </Link>
s
                    </div>
                </div>
            </div>
        </div>
    )
}
