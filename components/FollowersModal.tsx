
import useGetUserById from "@/hooks/useGetUserById";
import { FollowList } from "./FollowList";
import Modal from "./Modal"
import useFollowModal from "@/hooks/useFollowModal";



const FollowersModal = () => {
    const FollowModal = useFollowModal();
    const { isOpen, onClose } = FollowModal;
    const onChange = () => {
        if (isOpen) {
            onClose();
        }
    };
    return(
        <Modal
            title={'Followers'}
            description={`${'Followers'}`}
            isOpen={FollowModal.isOpen}
            onChange={onChange}>
            <FollowList userId={userId} type={type} />
        </Modal>
    )
}