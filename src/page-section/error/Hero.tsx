import HeroBackground from "@/src/component/HeroBackground";
import Typography from "@/src/component/Typography";
import Button from "@/src/component/Button";
import Tag from "@/src/component/Tag";

export default function Hero() {
    return (
        <HeroBackground>
            <div className="min-h-[75dvh] md:min-h-[70dvh] lg:min-h-[68dvh]w-full flex flex-col items-center">
                <Tag color="#fff" noDarkMode noIcon>Sorry for a while</Tag>
                <div className="flex flex-col items-center gap-[32px] md:gap-[12px] mt-[48px]">
                    <Typography as="div" color="#fff" className="text-center" size={88} sizeMobile={100} weight={600} lineHeightMobile={100} letterSpacing={-1.44} noDarkMode>
                        We hit <br className="md:hidden"/> a snag!
                    </Typography>
                    <Typography size={18} color="#BABABA" className="text-center w-full md:w-[80%]" noDarkMode>
                        It looks like there’s an issue with the website. Don’t worry; we’re on it! Our team is working hard to fix this as quickly as possible.
                    </Typography>
                </div>
                <Button variant="back" className="z-10 absolute bottom-[40px]">
                    Back to Home
                </Button>
            </div>
        </HeroBackground>
    )
}
