import { computable, InferBlueprint, observable, patch, PublishFunc } from "@chorda/core"
import { ReactDomEvents } from "@chorda/react"
import { faCamera } from "@fortawesome/free-solid-svg-icons"
import { Link, Modal, Image, Field, Button, Addon, Fields, Pagination } from "chorda-bulma"
import dayjs from "dayjs"
import { Nasa } from "../../api"
import { BgImage, FaIcon, FaSvgIcon, Text, Radio, Slider, Dropdown, DropdownPropsType, DropdownItem, DropdownItemPropsType, DropdownTrigger } from "../../helpers"
import { ListBlueprint, watch, withAs, withList } from "../../utils"


const photos = observable([] as Nasa.Photo[])


const CAMERAS = [
    {id: 'FHAZ', name: 'Front Hazard Avoidance Camera'},
    {id: 'RHAZ', name: 'Rear Hazard Avoidance Camera'},
    {id: 'MAST', name: 'Mast Camera'},
    {id: 'CHEMCAM', name: 'Chemistry and Camera Complex'},
    {id: 'MAHLI', name: 'Mars Hand Lens Imager'},
    {id: 'MARDI', name: 'Mars Descent Imager'},
    {id: 'NAVCAM', name: 'Navigation Camera'},
    {id: 'PANCAM', name: 'Panoramic Camera'},
    {id: 'MINITES', name: 'Miniature Thermal Emission Spectrometer (Mini-TES)'},
]

type Camera = {
    id: string
    name: string
}


type MarsScope = {
    roverImageUrl: string
    modal: boolean
    rover: Nasa.Rovers
    mission: Nasa.Mission
    page: number
    camera: string
    day: number
    totalPages: number
    pagePhotos: Nasa.Photo[]
}


const debounced = <T extends () => void>(timeout: number, fn: T) : any => {

    let t : any = null

    return () => {
        if (t) {
            clearTimeout(t)
        }
        t = setTimeout(() => {
            t = null
            fn()
        }, timeout)
    }
}


//console.log(dayjs('2012-08-06').diff('2021-10-19','days'))



export const Mars = () : InferBlueprint<MarsScope> => {
    return {
        templates: {
            form: {
                templates: {
                    mission: Fields({
                        label: 'Mission',
                        fields: [
                            Field({
                                control: {
                                    styles: {
                                        height: '2.5em',
                                        paddingTop: '0.375rem',
                                    },
                                    items: [
                                        Radio({
                                            name: Nasa.Rovers.Curiosity,
                                            label: 'Curiosity',
                                        }),
                                        Radio({
                                            label: 'Opportunity',
                                            name: Nasa.Rovers.Opportunity,
                                        }),
                                        Radio({
                                            label: 'Spirit',
                                            name: Nasa.Rovers.Spirit,
                                        }),
                                    ],
                                    defaultItem: Radio({
                                        value$: $ => computable(() => $.name == $.rover),
                                        onChange: (v, {rover, name}) => {
                                            rover.$value = name as Nasa.Rovers
                                        },
                                        as: {
                                            templates: {
                                                input: {
                                                    css: 'is-info'
                                                }
                                            }
                                        }
                                    }),
                                }
                            })
                        ]
                    }),
                    camera: Fields({
                        label: 'Camera',
                        fields: [
                            Field({
                                control: Dropdown(<DropdownPropsType<Camera, MarsScope>>{
                                    as: {
                                        css: 'camera-dropdown'
                                    },
                                    items$: $ => observable([{id: 'All', name: 'All cameras'}].concat(CAMERAS)),
                                    value$: $ => $.camera,
                                    text$: $ => $.selected.id,
                                    // trigger: DropdownTrigger({
                                    //     content: Button({
                                    //         text$: $ => $.se
                                    //     })
                                    // }),
                                    defaultItem: DropdownItem(<DropdownItemPropsType<Camera>>{
                                        text$: $ => $.item.id,
                                        as: {
                                            templates: {
                                                subtitle: Text({
                                                    css: 'item-subtitle',
                                                    text$: $ => $.item.name
                                                })
                                            }    
                                        }
                                    })
                                })
                            })
                        ]
                    }),
                    timeline: Fields({
                        label: 'Timeline',
                        fields: [
                            Field({
                                control: {
                                    css: 'is-flex is-align-items-center',
                                    styles: {
                                        height: '2.5em'
                                    },
                                    templates: {
                                        earth: {
                                            css: 'is-flex-grow-1 is-align-items-center earth-day-slider',
                                            templates: {
                                                content: Slider({
                                                    min: 0,
                                                    max$: $ => computable(() => {
                                                        return $.mission.photos.length - 1
                                                    }),
                                                    // max$: $ => computable(() => {
                                                    //     return dayjs($.mission.max_date).diff($.mission.landing_date, 'days')
                                                    // }),
                                                    value$: $ => observable(1000),
                                                    name: 'earth-slider',
                                                    as: {
                                                        templates: {
                                                            input: {
                                                                css: 'is-fullwidth is-info'
                                                            },
                                                            output: {
                                                                injections: {
                                                                    value: $ => computable(() => {
                                                                        return `${$.mission.photos[$.$context.value]?.earth_date} / ${$.mission.photos[$.$context.value]?.sol}` as any //dayjs($.mission.landing_date).add($.sol, 'days').format('YYYY-MM-DD') as any
                                                                    })
                                                                }
                                                            }
                                                        },
                                                        joints: {
                                                            deferredChange: ({value, day, mission}) => {

                                                                watch(debounced(300, () => {
                                                                    day.$value = value
                                                                }), [value])

                                                            }
                                                        }
                                                    }
                                                })
                                            }
                                        }
                                    }            
                                }
                            })
                        ]
                    })
                }
            },
            tiles: {
                templates: {
                    pagination: {
                        css: 'p-4',
                        templates: {
                            pages: Pagination({
                                maxPages$: $ => $.totalPages,
                                // maxPages$: $ => computable(() => {
                                //     return Math.ceil($.mission.photos?.[$.day].total_photos / 25)
                                // }),
                                current$: $ => $.page,
                                as: {
                                    css: 'rover-images-pagination is-centered'
                                }
                            })
                        }
                    },
                    content: withList(<ListBlueprint<Nasa.Photo, MarsScope, ReactDomEvents>>{
                        css: 'flex-tiles tiles-5',
                        defaultItem: withAs({
                            as: Link,
                            css: 'flex-tile',
                            templates: {
                                image: BgImage({
                                    url$: $ => $.item.img_src
                                }),
                                camera: Text({
                                    css: 'rover-camera',
                                    text$: $ => $.item.camera.name,
                                    as: {
                                        templates: {
                                            icon: FaIcon({
                                                icon: faCamera,
                                                as: {
                                                    weight: -10
                                                }
                                            })
                                        }
                                    }
                                })
                            },
                            events: {
                                $dom: {
                                    click: (e, {modal, roverImageUrl, item}) => {
                                        modal.$value = true
                                        roverImageUrl.$value = item.img_src
                                    }
                                }
                            }
                        }),
                        injections: {
                            items: $ => $.pagePhotos 
                        }
                    })
                }
            },
            modal: Modal({
                content: Image({
                    url$: $ => $.roverImageUrl
                }),
                active$: $ => $.modal,
            })
        },
        initials: {
            modal: () => observable(false),
            roverImageUrl: () => observable(null),
            rover: () => observable(Nasa.Rovers.Curiosity),
            mission: () => observable({photos: []} as Nasa.Mission),
            page: () => observable(1),
            camera: () => observable('All'),
            day: () => observable(0),
        },
        injections: {
            totalPages: $ => computable(() => {
                return Math.ceil(photos.length / 25)
            }),
            pagePhotos: $ => computable(() => {
                return photos.slice(($.page-1)*25, ($.page)*25)
            })
        },
        joints: {
            loadMissionManifest: ({mission, rover}) => {

                watch(() => {
                    Nasa.api.mars.getMission(rover).then(data => {
                        mission.$value = data.photo_manifest
                    })
                }, [rover])

            },
            loadPhotos: ({rover, page, camera, day, mission}) => {

                photos.$value = []

                watch(() => {
                    page.$value = 1
                }, [rover, camera, day, mission])

                watch(() => {
                    camera.$value = 'All'
                }, [rover])

                watch(() => {
                    Nasa.api.mars.getRoverPhotos(rover, mission.photos[day].sol, undefined, camera.$value == 'All' ? undefined : camera.$value)
                        .then(response => {
                            photos.$value = response.photos
                        })
               }, [rover, camera, day, mission])
                
            }
        }
    }
}