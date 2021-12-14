import { useState, useEffect } from 'react';
import { Modal,Form, Input, Button, Slider, InputNumber, Select} from 'antd';

import './FavoritesModal.scss'
import { addFavorites, editFavorites } from '../../redux/slices/favoritesSlice';
import { useDispatch } from 'react-redux';

const { Option } = Select;

export const FavoritesModal = ({ closeModal, initialValues, modalType, modalState }) => {
    const [form] = Form.useForm();

    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(false);
    const [sliderNumber, setSliderNumber] = useState(25);

    const onSliderChange = value => {
        setSliderNumber(value);
    }

    const onFinish = values => {
        values.slider = sliderNumber;
        if (modalType === 'add') {
            dispatch(addFavorites(values))
        } else {
            dispatch(editFavorites({values, id: initialValues.id}))
        }    
    }
    
    useEffect(() => {
        form.setFieldsValue(initialValues);
        setSliderNumber(+initialValues.slider);
    }, [initialValues, form]);

    return (
        <Modal
        title={ modalType === 'add' ? "Сохранить запрос" : "Изменить запрос"} 
        visible={modalState}
        onCancel={closeModal}
        initialValues={null}
        className={'modal'}
        footer={null}
        centered
        >
            <Form
            form={form}
            layout={'vertical'}
            onFinish={onFinish}
            >   
                <Form.Item
                name={'request'}
                label={'Запрос'}
                >
                    <Input disabled={modalType === 'add' ? true : false} />
                </Form.Item>

                <Form.Item
                name={'name'}
                label={'Название'}
                rules={[{
                    required: true,
                    message: 'Введите Название, пожалуйста',
                }]}
                >
                    <Input />
                </Form.Item>
                
                <Form.Item
                name={'sort'}
                label={'Сортировать по'}
                >
                    <Select
                    placeholder="Без сортировки"
                    suffixIcon={false}
                    >
                        <Option value="relevance">Релевантности</Option>
                        <Option value="rating">Просмотрам</Option>
                        <Option value="date">Дате</Option>
                    </Select>
                </Form.Item>
                
                <Form.Item
                name={'slider'}
                label={'Максимальное количество'}
                >   
                    <div className={'modal__slider'}>
                        <Slider
                        min={1}
                        max={50}
                        onChange={onSliderChange}
                        value={typeof sliderNumber === 'number' ? sliderNumber : 50}
                        />
                    
                        <InputNumber
                        min={1}
                        max={50}
                        style={{ margin: '0 16px' }}
                        controls={false}
                        value={sliderNumber}
                        onChange={onSliderChange}
                        />  
                    </div>
                </Form.Item>
                    
                {/* {requiredError && <p className="modal__error">Please fill in all fields</p>} */}

                <Button type="primary" htmlType="submit" loading={isLoading}>Сохранить</Button>
            </Form>
        </Modal>
    )
}