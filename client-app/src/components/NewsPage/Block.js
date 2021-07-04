import React, {useEffect, useState} from 'react';
import {$host} from "../../http";

const Block = ({block_count, project_id}) => {
    const [speeches, setSpeeches] = useState([])
    const [images, setImages] = useState([])
    const [audio, setAudio] = useState([])

    useEffect(async () => {
        let response = await $host.get(`api/news/getBlockContent?number=${block_count}&project_id=${project_id}`)
        const {audio, images, speeches} = response.data
        setAudio(audio)
        setImages(images)
        setSpeeches(speeches)
        console.log(response.data)
    }, [block_count])

    return (
        <div className="block">
            <div className="text_audio">
                <div className="text-block">
                    {speeches.map(speech => {
                        if (speech.actor === 'description') {
                            return <p style={{marginTop: 0}}>{speech.text}</p>
                        } else {
                            return <div>
                                <p className='actor'>{speech.actor}</p>
                                <p>{speech.text}</p>
                            </div>
                        }
                    })}
                </div>
                {audio.map(audio => {
                    return <audio controls className="audio">
                        <source src={`http://localhost:5000/soundtrack/${audio.path}`}/>
                    </audio>
                })}
            </div>
            <div className="image-container">
                {images.map(image => {
                    return <img className="block_image" src={`http://localhost:5000/storyboard/${image.path}`} alt={image.path}/>
                })}
            </div>
        </div>
    );
};

export default Block