import Typography from "@/src/component/Typography";
import Input from "@/src/component/Input";
import Button from "@/src/component/Button";

export default function Form() {
    return (
        <div className="bg-white dark:bg-[#070707] flex justify-center items-center py-[48px] md:py-[80px] px-[16px] md:px-[72px]">
            <div className="w-full lg:w-[35%] flex flex-col items-start gap-[48px]">
                <div className="flex flex-col items-start gap-[24px]">
                    <Typography size={32} weight={600}>
                        Chat Our Team
                    </Typography>
                    <Typography size={16}>
                        Get Instant Support – Chat with Our Team for Quick Assistance and
                        Expert Guidance Anytime!
                    </Typography>
                </div>
                <div className="w-full flex flex-col gap-[24px]">
                    <div className="w-full flex gap-[16px]">
                        <Input type="text" isRequired label="First name" placeholder="First name" />
                        <Input type="text" isRequired label="Last name" placeholder="Last name" />
                    </div>
                    <Input type="email" isRequired label="Email" placeholder="Email" />
                    <Input type="textarea" isRequired label="Message" placeholder="Message" />
                    <Button variant="form" className="px-[32px] py-[16px]">
                        Sent to Us
                    </Button>
                    <Typography size={14} weight={500} className="text-center">
                        By Contacting us, you agree to our <span className="text-[#873AE3]">Terms</span> of service <br />
                        and <span className="text-[#873AE3]">privacy Policy</span>
                    </Typography>
                </div>
            </div>
        </div>
    )
}
