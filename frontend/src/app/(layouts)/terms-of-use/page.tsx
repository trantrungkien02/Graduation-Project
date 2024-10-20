'use client';
import React from 'react';
import Image from 'next/image';
import './termOfUse.scss';
import { Form, Input, Pagination, Select } from 'antd';
import type { SelectProps } from 'antd';
import { images } from '~/assets/images';

type Props = {};

const page = (props: Props) => {
    return (
        <div className="flex flex-col items-center h-full">
            <div
                className="flex flex-col justify-center items-start w-[60%] xxl:w-[55%] mx-auto text-gray-900 mt-[30px] p-8 rounded "
                style={{ background: 'rgba(255, 255, 255, 0.4)' }}
            >
                <h2 className="text-[28px] font-medium leading-normal pb-[30px]">Chính sách về quyền riêng tư</h2>
                <div>
                    <div className="custom-content-terms-of-use text-gray-900 text-base leading-[100%] font-normal">
                        <p>
                            Chúng tôi, KT Group, cam kết bảo vệ quyền riêng tư của người dùng và xử lý dữ liệu cá nhân
                            một cách cẩn thận và minh bạch. Chính sách này mô tả cách chúng tôi thu thập, sử dụng, bảo
                            vệ và chia sẻ thông tin cá nhân mà bạn cung cấp khi sử dụng trang web bán khóa học của chúng
                            tôi:
                        </p>
                        <ul>
                            <li>Những thông tin nào được thu thập</li>
                            <li>Cách thông tin đã thu thập được sử dụng</li>
                            <li>Các thông tin khác về quyền riêng tư</li>
                            <li>Thông tin được cung cấp ra bên ngoài như thế nào</li>
                        </ul>
                        <p>
                            Chính sách quyền riêng tư này đề cập đến các thông tin chúng tôi thu thập về bạn khi bạn sử
                            dụng sản phẩm hoặc dịch vụ của chúng tôi hoặc tương tác với chúng tôi (ví dụ khi đăng ký
                            tham gia sự kiện của chúng tôi hoặc khi cách liên hệ với chúng tôi).
                        </p>
                        <p>
                            Chính sách này cũng giải thích các hành động có thể của bạn đối với việc chúng tôi sử dụng
                            thông tin về bạn, bao gồm việc bạn có thể phản đối việc sử dụng một số thông tin nhất định
                            về bạn và việc bạn có thể truy cập và cập nhật một số thông tin của mình.Nếu bạn không đồng
                            ý với chính sách này, thì hãy không truy cập hoặc sử dụng dịch vụ hoặc tương tác với bất kỳ
                            hoạt động kinh doanh của chúng tôi.
                        </p>
                        <p>
                            Khi chúng tôi cung cấp dịch vụ cho một tổ chức, mà bạn sử dụng lại dịch vụ từ tổ chức đó thì
                            thông tin của bạn sẽ được tổ chức đó quản lý.Để biết thêm thông tin, vui lòng xem mục “Thông
                            báo dành cho người dùng cuối” bên dưới.Chính sách này không áp dụng khi chúng tôi xử lý
                            thông tin cá nhân với vai trò là người thay mặt cho các tổ chức đó.
                        </p>
                        <h2>I. NHỮNG THÔNG TIN NÀO ĐƯỢC THU THẬP</h2>
                        <p>
                            Để cung cấp dịch vụ tốt nhất, chúng tôi có thể thu thập nhiều loại thông tin khác nhau khi
                            bạn tương tác với trang web:
                        </p>

                        <ul>
                            <li>
                                Thông tin cá nhân cơ bản: bao gồm họ tên, địa chỉ email, số điện thoại, ngày sinh, và
                                thông tin khác bạn cung cấp khi tạo tài khoản hoặc liên hệ với chúng tôi.
                            </li>

                            <li>
                                Thông tin liên quan đến học tập: bao gồm các khóa học bạn đã đăng ký, tiến độ học tập,
                                kết quả bài thi, và phản hồi của bạn về khóa học.
                            </li>
                            <li>
                                Thông tin thanh toán: bao gồm thông tin thẻ tín dụng, thẻ ghi nợ, tài khoản ngân hàng,
                                và các chi tiết liên quan đến giao dịch mua khóa học.
                            </li>
                            <li>
                                Dữ liệu về hoạt động người dùng: thông tin về cách bạn sử dụng trang web, bao gồm lịch
                                sử duyệt web, thời gian truy cập, địa chỉ IP, trình duyệt và thiết bị sử dụng.
                            </li>
                            <li>
                                Thông tin do bên thứ ba cung cấp: chúng tôi có thể thu thập thông tin từ các bên cung
                                cấp dịch vụ, bao gồm các nền tảng truyền thông xã hội nếu bạn kết nối tài khoản của mình
                                với dịch vụ của họ.
                            </li>
                            <li>Các thông tin về cookies trên trình duyệt.</li>
                        </ul>

                        <h2>II. MỤC ĐÍCH SỬ DỤNG THÔNG TIN</h2>
                        <p>
                            Cách chúng tôi sử dụng thông tin thu thập được phụ thuộc vào một phần dịch vụ bạn sử dụng,
                            cách bạn sử dụng chúng và các tùy chọn mà bạn đã thông báo cho chúng tôi. Dưới đây là các
                            mục đích cụ thể của việc sử dụng thông tin thu thập được:
                        </p>
                        <ul>
                            <li>
                                Cung cấp dịch vụ và khóa học: Để quản lý tài khoản của bạn, ghi danh và theo dõi tiến độ
                                học tập của bạn trong các khóa học.
                            </li>
                            <li>
                                Cải thiện dịch vụ: Chúng tôi sử dụng thông tin người dùng để hiểu rõ hơn về nhu cầu học
                                tập và cải tiến chất lượng khóa học cũng như trải nghiệm người dùng.
                            </li>
                            <li>
                                Giao tiếp với bạn: Gửi email xác nhận, cập nhật về khóa học, các chương trình khuyến
                                mãi, thông báo thay đổi về dịch vụ hoặc chính sách.
                            </li>
                            <li>
                                Xử lý thanh toán: Đảm bảo rằng các giao dịch mua khóa học diễn ra an toàn và bảo mật.
                            </li>
                            <li>
                                Phân tích dữ liệu: Chúng tôi có thể sử dụng dữ liệu tổng hợp và ẩn danh để phân tích xu
                                hướng sử dụng, cải thiện hệ thống, và phát triển các sản phẩm mới.
                            </li>
                            <li>
                                Tiếp thị và quảng cáo: Nếu bạn đồng ý, chúng tôi có thể gửi cho bạn các thông tin quảng
                                cáo về các khóa học mới, giảm giá và các nội dung khác có thể bạn quan tâm.
                            </li>
                        </ul>
                        <h2>III. BẢO MẬT THÔNG TIN</h2>

                        <p>
                            Chúng tôi đặc biệt coi trọng việc bảo vệ dữ liệu cá nhân của bạn. Các biện pháp bảo mật bao
                            gồm:
                        </p>
                        <ul>
                            <li>
                                Mã hóa SSL: Tất cả các giao dịch trên trang web của chúng tôi được mã hóa bằng công nghệ
                                SSL (Secure Sockets Layer) để đảm bảo an toàn cho dữ liệu thanh toán của bạn.
                            </li>
                            <li>
                                Kiểm soát truy cập: Chỉ những nhân viên có quyền hạn nhất định mới được truy cập vào dữ
                                liệu cá nhân của bạn, và họ được yêu cầu tuân thủ các quy định bảo mật nghiêm ngặt.
                            </li>
                            <li>
                                Giám sát bảo mật: Chúng tôi thường xuyên giám sát hệ thống để phát hiện và ngăn chặn các
                                vi phạm bảo mật tiềm ẩn, bao gồm các cuộc tấn công mạng hoặc xâm phạm dữ liệu.
                            </li>
                            <li>
                                Lưu trữ dữ liệu an toàn: Chúng tôi lưu trữ dữ liệu trên các máy chủ an toàn và tuân thủ
                                các quy định pháp lý về bảo mật thông tin.
                            </li>
                        </ul>

                        <h2>IV. CÁC THÔNG TIN KHÁC VỀ QUYỀN RIÊNG TƯ</h2>

                        <p>
                            Sản phẩm của chúng tôi được thiết kế để các tổ chức sử dụng. Khi dịch vụ được cung cấp cho
                            bạn thông qua một tổ chức (Ví dụ: Công ty chủ lao động của bạn), tổ chức đó là quản trị viên
                            của một dịch vụ và chịu trách nhiệm về các tài khoản và/hoặc trang web dịch vụ tổ chức đó có
                            quyền kiểm soát. Trong trường hợp này, vui lòng gửi câu hỏi về quyền riêng tư dữ liệu của
                            bạn cho người quản trị viên của tổ chức đó. Chúng tôi không chịu trách nhiệm về các biện
                            pháp bảo mật hoặc quyền riêng tư của tổ chức đó.
                        </p>

                        <ul>
                            <li>
                                Nhà cung cấp dịch vụ: Chúng tôi có thể chia sẻ thông tin với các nhà cung cấp dịch vụ
                                bên thứ ba giúp xử lý thanh toán, cung cấp khóa học hoặc hỗ trợ khách hàng. Các đối tác
                                này cũng phải tuân thủ các quy định bảo mật của chúng tôi.
                            </li>
                            <li>
                                Các đối tác khóa học: Đối với các khóa học do đối tác cung cấp, chúng tôi có thể chia sẻ
                                thông tin với các giảng viên hoặc tổ chức cung cấp khóa học để đảm bảo bạn được tiếp cận
                                nội dung và hỗ trợ học tập tốt nhất.
                            </li>
                            <li>
                                Yêu cầu pháp lý: Chúng tôi sẽ chia sẻ thông tin cá nhân của bạn khi có yêu cầu từ các cơ
                                quan chính phủ, cơ quan thực thi pháp luật, hoặc trong các trường hợp cần thiết để tuân
                                thủ quy định pháp luật.
                            </li>
                            <li>
                                Bên thứ ba tiếp thị: Nếu bạn đồng ý, chúng tôi có thể chia sẻ thông tin với các đối tác
                                tiếp thị để cung cấp các nội dung quảng cáo hoặc chương trình khuyến mãi phù hợp với nhu
                                cầu của bạn.
                            </li>
                        </ul>
                        <h2>V. COOKIES VÀ CÔNG NGHỆ THEO DÕI</h2>

                        <p>
                            Trang web của chúng tôi sử dụng cookies và các công nghệ theo dõi khác để cải thiện trải
                            nghiệm người dùng và cung cấp nội dung phù hợp. Chúng tôi sử dụng các loại cookies sau:
                        </p>

                        <ul>
                            <li>
                                Cookies cần thiết: Được sử dụng để trang web hoạt động bình thường, như đăng nhập và xử
                                lý thanh toán.
                            </li>
                            <li>
                                Cookies chức năng: Giúp lưu trữ các lựa chọn của bạn, như ngôn ngữ hoặc khóa học yêu
                                thích.
                            </li>
                            <li>
                                Cookies phân tích: Được sử dụng để theo dõi hành vi của người dùng trên trang web và
                                phân tích dữ liệu nhằm cải thiện dịch vụ.
                            </li>
                            <li>
                                Cookies quảng cáo: Được sử dụng để cung cấp các quảng cáo cá nhân hóa dựa trên lịch sử
                                duyệt web của bạn.
                            </li>
                        </ul>
                        <h2>VI. QUYỀN LỢI CỦA NGƯỜI DÙNG</h2>

                        <p>Bạn có các quyền sau đối với thông tin cá nhân của mình:</p>

                        <ul>
                            <li>
                                Truy cập thông tin: Bạn có quyền yêu cầu truy cập vào dữ liệu cá nhân mà chúng tôi đang
                                lưu trữ.
                            </li>
                            <li>
                                Chỉnh sửa thông tin: Bạn có thể yêu cầu chỉnh sửa hoặc cập nhật thông tin không chính
                                xác hoặc không đầy đủ.
                            </li>
                            <li>
                                Xóa thông tin: Bạn có quyền yêu cầu xóa thông tin cá nhân của mình nếu không còn cần
                                thiết cho mục đích sử dụng.
                            </li>
                            <li>
                                Phản đối việc xử lý thông tin: Nếu bạn không đồng ý với cách chúng tôi xử lý thông tin,
                                bạn có thể yêu cầu ngừng sử dụng hoặc hạn chế việc xử lý dữ liệu của mình.
                            </li>
                            <li>
                                Rút lại sự đồng ý: Bạn có thể rút lại sự đồng ý của mình đối với việc sử dụng thông tin
                                cá nhân bất kỳ lúc nào, đặc biệt là đối với mục đích tiếp thị.
                            </li>
                        </ul>

                        <h2>VII. CHÍNH SÁCH CỦA CHÚNG TÔI ĐỐI VỚI TRẺ EM</h2>
                        <p>
                            Dịch vụ không hướng tới các cá nhân dưới 12 tuổi. Chúng tôi không thu thập thông tin cá nhân
                            từ trẻ em dưới 12 tuổi. Nếu chúng tôi biết rằng một trẻ em dưới 12 tuổi đã cung cấp cho
                            chúng tôi thông tin cá nhân, chúng tôi sẽ thực hiện các bước để xóa thông tin đó. Nếu bạn
                            biết rằng một trẻ em đã cung cấp cho chúng tôi thông tin cá nhân, vui lòng liên hệ với chúng
                            tôi.
                        </p>
                        <h3>VIII. NHỮNG THAY ĐỔI ĐỐI VỚI CHÍNH SÁCH QUYỀN RIÊNG TƯ</h3>
                        <p>
                            Khi cần chúng tôi có thể thay đổi chính sách riêng tư này. Chúng tôi sẽ đăng các thay đổi về
                            chính sách quyền riêng tư trên trang này và nếu những thay đổi đó quan trọng, chúng tôi sẽ
                            cho thông báo trên trang chủ dịch vụ, trên màn hình đăng nhập hoặc bằng cách gửi cho bạn qua
                            email. Chúng tôi cũng lưu trữ các phiên bản trước của chính sách quyền riêng tư này để bạn
                            xem xét. Chúng tôi khuyến khích bạn xem lại chính sách quyền riêng tư của chúng tôi bất cứ
                            khi nào bạn sử dụng dịch vụ để bảo vệ quyền riêng tư của chính mình.
                        </p>
                        <p>
                            Nếu bạn không đồng ý với bất kỳ thay đổi nào đối với chính sách quyền riêng tư này, bạn có
                            thể ngừng sử dụng dịch vụ và đóng tài khoản của mình.
                        </p>
                        <h4 className="">Liên hệ:</h4>
                        <p>Thông tin của bạn được kiểm soát bởi KT Group.</p>

                        <ul>
                            <li>
                                Địa chỉ:
                                <strong>Nghĩa Hưng, Nam Định</strong>
                            </li>
                            <li>
                                Email:<strong>trantrungkien14102002@gmail.com</strong>
                            </li>
                            <li>
                                Contact:<strong>https://www.facebook.com/kien.trantrung.14473426</strong>
                            </li>
                            <li>
                                Phone:<strong>0776 499 168</strong>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="absolute top-1/2 -z-50">
                <div className="ant-image">
                    <Image alt="map" src={images.mapBase} />
                </div>
            </div>
        </div>
    );
};

export default page;
