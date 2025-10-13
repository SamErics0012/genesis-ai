import HeroBackground from "@/src/component/HeroBackground";
import Typography from "@/src/component/Typography";
import Button from "@/src/component/Button";

export default function Hero() {
    return (
        <HeroBackground>
            <div className="min-h-[75dvh] md:min-h-[70dvh] lg:min-h-[67dvh] w-full flex flex-col items-center">
                <div className="flex flex-col items-center gap-[24px]">
                    <Typography as="div" color="#fff" className="text-center" size={48} weight={600} letterSpacing={-1.44} noDarkMode>
                        Ooops! <br className="md:hidden" />
                        Page Not Found
                    </Typography>
                    <Typography size={18} color="#BABABA" className="text-center w-full md:w-[90%] lg:w-[55%] text-[#ADADAD]" noDarkMode>
                        The page you’re looking for doesn’t exist—or maybe it’s taking a coffee break. But don’t worry, we’re here to guide you back on track.
                    </Typography>
                </div>
                <div className="text-[202px] md:text-[403px] lg:text-[499.474px] text-[#fff] font-semibold absolute top-[75%] md:top-[70%] translate-y-[-50%]">
                    404
                </div>
                <Button variant="back" className="z-10 absolute bottom-[40px]">
                    Back to Home
                </Button>
            </div>
        </HeroBackground>
    )
}
