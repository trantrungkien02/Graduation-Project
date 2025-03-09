import Link from 'next/link';
import './index.scss';
import Image from 'next/image';
import { images } from '~/assets/images';
import { icons } from '~/assets/images/icons/icons';

function Footer() {
    return (
        <div className="footer relative overflow-hidden mt-[100px]">
            <svg
                width="100%"
                height="100%"
                className="absolute top-[-48%] right-[-5%] md:left-[-4%] z-0 w-[24%]"
                viewBox="0 0 338 338"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle cx="168.891" cy="168.685" r="168.574" fill="#ffffff1a"></circle>
            </svg>
            <div className="footer-container overflow-hidden pt-7 sm:pt-8 md:pt-10 xl:pt-16 xxl:pt-20 xxl:mx-auto">
                <div className="footer-content relative text-white grid grid-cols-1 sm:grid-cols-2 md:flex sm:gap-x-6 md:px-10 xl:px-14 pb-10 xl:pb-14 px-6 ">
                    <Image alt="" src={images.footerShape} className="absolute w-[5%] top-2/3 left-[8%] z-10" />
                    <Image
                        alt=""
                        src={images.footerShape2}
                        className="absolute w-[10%] hidden md:block right-[8%] z-10"
                    />
                    <Image
                        alt=""
                        src={images.footerShape3}
                        className="absolute w-[30%] md:w-[8%] bottom-[5%] md:bottom-[12%] right-[-10%] md:right-[5%] z-0"
                    />
                    <div className="text-content contact pb-7 pt-[50px]">
                        <h3 className="text-[#fff]">Contact</h3>
                        <div className="flex flex-col items-start opacity-[0.84] max-w-[19rem]">
                            <Link href="https://mail.google.com/mail/?view=cm&fs=1&to=kiencutet@gmail.com">
                                Email:
                                <span> Kiencutet@gmail.com</span>
                            </Link>
                            <Link href="tel:+(84) 776 499 168">
                                Số điện thoại:
                                <span>+(84) 776 499 168</span>
                            </Link>
                            <p className="cursor-text">
                                Địa chỉ văn phòng: <span> Di Trạch, Di Ái, Hoài Đức, Hà Nội</span>
                            </p>
                        </div>
                    </div>
                    <div className="product-services text-content pb-7 sm:pt-[50px] ml-[74px]">
                        <div className="flex justify-start items-start gap-14 md:gap-0">
                            <div className="w-full">
                                <h3 className="text-white text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl xxl:text-[25px] font-semibold xl:pb-8 title">
                                    About KT
                                </h3>
                                <ul className="grid">
                                    <li>
                                        <a href="/about-us">
                                            <p className="opacity-[0.84] hover:opacity-100">Giới thiệu</p>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="/about#feature">
                                            <p className="opacity-[0.84] hover:opacity-100">Tính năng</p>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div className="w-full">
                                <h3 className="text-white text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl xxl:text-[25px] font-semibold xl:pb-8 title">
                                    Solution
                                </h3>
                                <ul className="grid">
                                    <li>
                                        <a href="/about#foratrial">
                                            <p className="opacity-[0.84] hover:opacity-100">Đăng ký dùng thử</p>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="/faqs">
                                            <p className="opacity-[0.84] hover:opacity-100">Faqs</p>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="/help">
                                            <p className="opacity-[0.84] hover:opacity-100">Help Center</p>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="dowloadapp text-content md:pt-[50px]">
                        <h3 className="title pb-2.5 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl xxl:text-[25px] font-semibold xl:pb-8">
                            Trải nghiệm ứng dụng!
                        </h3>
                        <div className="flex flex-row sm:flex-col gap-7 sm:gap-5">
                            <button type="button" className="ant-btn ant-btn-default btn-store">
                                <Image alt="" src={icons.appStore} className="mx-[10px]" />
                                <span>App Store</span>
                            </button>
                            <button type="button" className="ant-btn ant-btn-default btn-store">
                                <Image alt="" src={icons.playStore} className="mx-[10px]" />
                                <span>Play Store</span>
                            </button>
                        </div>
                    </div>
                </div>
                <hr className="w-full xl:w-10/12 mx-auto opacity-30"></hr>
                <div className="flex justify-between py-2 xxl:py-6 text-white w-10/12 mx-auto">
                    <Link href="https://tinasoft.vn/"> © 2024 KTGROUP VIỆT NAM</Link>
                    <div className="flex items-center">
                        <p className="opacity-[0.84] hover:opacity-100 cursor-text">Privacy Policy</p>
                        <svg
                            width="6px"
                            height="100%"
                            className="mx-6"
                            viewBox="0 0 338 338"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <circle cx="168.891" cy="168.685" r="168.574" fill="#2B59FF"></circle>
                        </svg>
                        <p className="opacity-[0.84] hover:opacity-100 cursor-text">Refund Policy</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Footer;
