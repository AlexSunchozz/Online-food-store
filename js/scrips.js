window.addEventListener('DOMContentLoaded', function() {

    // Tabs
    
	let tabs = document.querySelectorAll('.tabheader__item'),
		tabsContent = document.querySelectorAll('.tabcontent'),
		tabsParent = document.querySelector('.tabheader__items');

	function hideTabContent() {
        
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
	}

	function showTabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }
    
    hideTabContent();
    showTabContent();

	tabsParent.addEventListener('click', function(event) {
		const target = event.target;
		if(target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
		}
	});


    // Timer

    const deadline = '2023-05-11';

    function getTimeRemaining(endtime) {
        let days, hours, minutes, seconds;
        const t = Date.parse(endtime) - Date.parse(new Date());

        if (t <= 0) {
            days = 0;
            hours = 0;
            minutes = 0;
            seconds = 0;
        } else {
            days = Math.floor(t / (1000 * 60 * 60 * 24)),
            hours = Math.floor((t / (1000 * 60 * 60) % 24)),
            minutes = Math.floor((t / 1000 / 60) % 60),
            seconds = Math.floor((t / 1000) % 60);
        }

        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`; 
        } else return num       
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
              days = timer.querySelector('#days'),
              hours = timer.querySelector('#hours'),
              minutes = timer.querySelector('#minutes'),
              seconds = timer.querySelector('#seconds'),
              timeInterval = setInterval(updateClock, 1000);

        updateClock()

        function updateClock() {
            const t = getTimeRemaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }   

    setClock('.timer', deadline)


    // Modal

    const modalTrigger = document.querySelectorAll('[data-modal]'),
          modal = document.querySelector('.modal');
    
    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show')
        document.body.style.overflow = ''
    }

    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden'
        clearInterval(modalTimerId)
    }

    const modalTimerId = setTimeout(openModal, 50000)

    modalTrigger.forEach(e => {
        e.addEventListener('click', openModal)
    })

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-close') === '') {
            closeModal()
        }
    })

    document.addEventListener('keydown', (e) => {
        if (e.code === "Escape" && modal.classList.contains('show')) closeModal()
    })

    function shpwModalByScroll() {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight -1) {
            openModal()
            window.removeEventListener('scroll', shpwModalByScroll)
        }
    }

    window.addEventListener('scroll', shpwModalByScroll)

    // Card Class

    // class MenuCard {
    //     constructor(src, alt, title, descr, price, parentSelector, ...classes) {
    //         this.src = src;
    //         this.alt = alt;
    //         this.title = title;
    //         this.descr = descr;
    //         this.price = price;
    //         this.classes = classes;
    //         this.parent = document.querySelector(parentSelector);
    //         this.transfer = 27;
    //         this.changeToUAH();
    //     }

    //     changeToUAH() {
    //         this.price = this.price * this.transfer;
    //     }

    //     render() {
    //         const element = document.createElement('div');

    //         if (this.classes.length === 0) {
    //             this.element = 'menu__item'
    //             element.classList.add(this.element)
    //         } else {
    //             this.classes.forEach(className => element.classList.add(className))
    //         }

    //         element.innerHTML = `
    //             <img src=${this.src} alt=${this.alt}>
    //             <h3 class="menu__item-subtitle">${this.title}</h3>
    //             <div class="menu__item-descr">${this.descr}</div>
    //             <div class="menu__item-divider"></div>
    //             <div class="menu__item-price">
    //                 <div class="menu__item-cost">Цена:</div>
    //                 <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
    //             </div>
    //         `
    //         this.parent.append(element)
    //     }
    // }

    const getResource = async (url) => {
        const res = await fetch(url)

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    }

    // getResource('http://localhost:3000/menu')
    // .then(data => {
    //     data.forEach(({img, altimg, title, descr, price}) => {
    //         new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
    //     });
    // });


    // Axios
    axios.get('http://localhost:3000/menu')
    .then(data => createCard(data.data));


    // Заменяем класс карточки товаров
    // getResource('http://localhost:3000/menu')
    // .then(data => createCard(data))

    function createCard(data) {
        data.forEach(({img, altimg, title, descr, price}) => {
            const element = document.createElement('div');
            element.classList.add('menu__item');

            element.innerHTML = `
                <img src=${img} alt=${altimg}>
                <h3 class="menu__item-subtitle">${title}</h3>
                <div class="menu__item-descr">${descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${price}</span> грн/день</div>
                </div>
            `;

            document.querySelector('.menu .container').append(element);
        })
    }


    // Server Forms

    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо! Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так...'
    }
    
    forms.forEach(item => {
        bindPostData(item);
    })

    // 1) Формат строчный

    
    // function postData(form) {
    //     form.addEventListener('submit', (e) => {
    //         e.preventDefault();

    //         const statusMessage = document.createElement('div');
    //         statusMessage.classList.add('status');
    //         statusMessage.textContent = message.loading;

    //         form.append(statusMessage);

    //         const request = new XMLHttpRequest();
    //         request.open('POST', 'server.php');

    //         const formData = new FormData(form);

    //         request.send(formData);

    //         request.addEventListener('load', () => {
    //             if (request.status === 200) {
    //                 console.log(request.response);
    //                 statusMessage.textContent = message.success;
    //                 form.reset();
    //                 setTimeout(() => {
    //                     statusMessage.remove()
    //                 }, 2000)
    //             } else {
    //                 statusMessage.textContent = message.failure;
    //             }
    //         })
    //     })
    // }


    // 2) Формат JSON

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-type" : "application/json"
            },
            body: data
        })

        return await res.json();
    }

    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            let statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;

            form.insertAdjacentElement('afterend', statusMessage);

            // const request = new XMLHttpRequest();
            // request.open('POST', 'server.php');
            // request.setRequestHeader('Content-type', 'application/json')

            const formData = new FormData(form);

            // const object = {}
            // formData.forEach(function(value, key) {
            //     object[key] = value;
            // });

            // Аналог преобразование  FormData
            const json = JSON.stringify(Object.fromEntries(formData.entries()))

            // Fetch реализация вместо XMLHttpRequest
            
            postData('http://localhost:3000/requests', json)
            .then(data => {
                console.log(data);
                showThanksModal(message.success);
                statusMessage.remove();
            })
            .catch(() => {
                showThanksModal(message.failure);
            })
            .finally(() => {
                form.reset();
            });


            // request.send(json);

            // request.addEventListener('load', () => {
            //     if (request.status === 200) {
            //         console.log(request.response);
            //         showThanksModal(message.success);
            //         form.reset();
            //         statusMessage.remove();
            //     } else {
            //         showThanksModal(message.failure);
            //     }
            // })
        })
    }


    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>&times;</div>
                <div class="modal__title">${message}</div>
            </div>
        `;

        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('hide');
            prevModalDialog.classList.remove('hide');
            closeModal();
        }, 4000)
    }


    // Slider part 1

    const slides = document.querySelectorAll('.offer__slide'),
            next = document.querySelector('.offer__slider-next'),
            prev = document.querySelector('.offer__slider-prev'),
            total = document.querySelector('#total'),
            current = document.querySelector('#current');

    // let slideIndex = 1;

    // showSlides(slideIndex);

    // if (slides.length < 10) {
    //     total.textContent = `0${slides.length}`;
    // } else {
    //     total.textContent = slides.length;
    // }

    // function showSlides(n) {
    //     if (n > slides.length) {
    //         slideIndex = 1;
    //     }

    //     if (n < 1) {
    //         slideIndex = slides.length;
    //     }

    //     slides.forEach(item => item.style.display = 'none');
    //     slides[slideIndex - 1].style.display = 'block';

    //     if (slides.length < 10) {
    //         current.textContent = `0${slideIndex}`;
    //     } else {
    //         current.textContent = slideIndex;
    //     }
    // }

    // function plussSlides(n) {
    //     showSlides(slideIndex += n);
    // }

    // prev.addEventListener('click', () => {
    //     plussSlides(-1);
    // })

    // next.addEventListener('click', () => {
    //     plussSlides(+1);
    // })


    // Slider part 2

    const slidesWrapper = document.querySelector('.offer__slider-wrapper'),
          slidesField = document.querySelector('.offer__slider-inner'),
          width = this.window.getComputedStyle(slidesWrapper).width;

    let slideIndex = 1;
    let offset = 0;

    if (slides.length < 10) {
        total.textContent = `0${slides.length}`;
        current.textContent = `0${slideIndex}`;
    } else {
        total.textContent = slides.length;
        current.textContent = slideIndex;
    }

    slidesField.style.width = 100 * slides.length + '%';
    slidesField.style.display = 'flex';
    slidesField.style.transition = 'all 0.5s';

    slidesWrapper.style.overflow = 'hidden';

    slides.forEach(slide => {
        slide.style.width = width;
    })

    next.addEventListener('click', () => {
        if (offset === +width.slice(0, width.length - 2) * (slides.length - 1)) {
            offset = 0;
        } else {
            offset += +width.slice(0, width.length - 2);
        }

        slidesField.style.transform = `translateX(-${offset}px)`;

        if (slideIndex == slides.length) {
            slideIndex = 1
        } else {
            slideIndex ++;
        }

        if (slides.length < 10) {
            current.textContent = `0${slideIndex}`;
        } else {
            current.textContent = slideIndex;
        }
    })

    prev.addEventListener('click', () => {
        if (offset == 0) {
            offset = +width.slice(0, width.length - 2) * (slides.length - 1)
        } else {
            offset -= +width.slice(0, width.length - 2);
        }
        
        slidesField.style.transform = `translateX(-${offset}px)`;

        if (slideIndex == 1) {
            slideIndex = slides.length;
        } else {
            slideIndex --;
        }

        if (slides.length < 10) {
            current.textContent = `0${slideIndex}`;
        } else {
            current.textContent = slideIndex;
        }
    })

});