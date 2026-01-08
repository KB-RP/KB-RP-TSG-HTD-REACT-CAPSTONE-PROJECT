import React from 'react';
import { Modal } from 'antd';

function getYoutubeVideoId(url) {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2] && match[2].length === 11 ? match[2] : '';
}

const CoursePreviewModal = ({ open, onClose, url, title = 'Preview' }) => {
  const videoId = getYoutubeVideoId(url);

  return (
    <Modal
      title={title}
      open={!!open}
      onCancel={onClose}
      footer={null}
      width={800}
      destroyOnClose
    >
      <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
        {videoId && (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Course Preview"
          />
        )}
      </div>
    </Modal>
  );
};

export default CoursePreviewModal;

