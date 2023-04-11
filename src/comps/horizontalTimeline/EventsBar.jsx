import { useEffect, useState } from "react";
import { Motion, spring } from "react-motion";
import PropTypes from "prop-types";

import Faders from "./Faders";
import Events from "./Events";
import EventLine from "./EventLine";
import TimelineButtons from "./TimelineButtons";

import Constants from "./constants";

function EventsBar(props) {
    const [position, setPosition] = useState(0);
    const [maxPosition, setMaxPosition] = useState(
        Math.min(props.visibleWidth - props.totalWidth, 0)
    );

    // constructor(props) {
    //     super(props);

    // state = {
    //     position: 0,
    //     maxPosition: Math.min(props.visibleWidth - props.totalWidth, 0),
    // };

    let touch = {
        coors: { x: 0, y: 0 },
        isSwiping: false,
        started: false,
        threshold: 3,
    };
    // }

    // componentDidMount() {
    //     const selectedEvent = props.events[props.index];
    //     slideToPosition(-(selectedEvent.distance - props.visibleWidth / 2), props);
    // }
    // useEffect(() => {
    //     // console.log('component mounted!')
    //     const selectedEvent = props.events[props.index];
    //     slideToPosition(
    //         -(selectedEvent.distance - props.visibleWidth / 2),
    //         props.visibleWidth,
    //         props.totalWidth
    //     );
    // }, []);

    // componentWillMount() {
    //     document.body.addEventListener("keydown", handleKeydown);
    // }
    // componentWillUnmount() {
    //     document.body.removeEventListener("keydown", handleKeydown);
    // }
    useEffect(() => {
        // console.log('component mounted')
        document.body.addEventListener("keydown", handleKeydown);

        return () => {
            //   console.log('component will unmount')
            document.body.removeEventListener("keydown", handleKeydown);
        };
    }, []);

    // componentWillReceiveProps(props) {
    //     const selectedEvent = props.events[props.index];
    //     const minVisible = -position; // Position is always negative!
    //     const maxVisible = minVisible + props.visibleWidth;

    //     if (selectedEvent.distance > minVisible + 10 && selectedEvent.distance < maxVisible - 10) {
    //         //Make sure we are not outside the view
    //         slideToPosition(position, props);
    //     } else {
    //         //Try to center the selected index
    //         slideToPosition(-(selectedEvent.distance - props.visibleWidth / 2), props);
    //     }
    // }
    useEffect(() => {
        const selectedEvent = props.events[props.index];
        const minVisible = -position; // Position is always negative!
        const maxVisible = minVisible + props.visibleWidth;

        if (selectedEvent.distance > minVisible + 10 && selectedEvent.distance < maxVisible - 10) {
            //Make sure we are not outside the view
            slideToPosition(position, props.visibleWidth, props.totalWidth);
        } else {
            //Try to center the selected index
            slideToPosition(
                -(selectedEvent.distance - props.visibleWidth / 2),
                props.visibleWidth,
                props.totalWidth
            );
        }
    }, []);

    const handleKeydown = (event) => {
        if (props.isKeyboardEnabled) {
            if (event.keyCode === Constants.LEFT_KEY || event.keyCode === Constants.RIGHT_KEY) {
                updateSlide(Constants.KEYMAP[event.keyCode]);
            } else if (event.keyCode === Constants.UP_KEY) {
                props.indexClick(Math.min(props.selectedIndex + 1, props.events.length - 1));
            } else if (event.keyCode === Constants.DOWN_KEY) {
                props.indexClick(Math.max(props.selectedIndex - 1, 0));
            }
        }
    };

    const handleTouchStart = (event) => {
        const touchObj = event.touches[0];
        touch.coors.x = touchObj.pageX;
        touch.coors.y = touchObj.pageY;
        touch.isSwiping = false;
        touch.started = true;
    };

    const handleTouchMove = (event) => {
        if (!touch.started) {
            handleTouchStart(event);
            return;
        }

        const touchObj = event.touches[0];
        const dx = Math.abs(touch.coors.x - touchObj.pageX);
        const dy = Math.abs(touch.coors.y - touchObj.pageY);

        const isSwiping = dx > dy && dx > touch.threshold;

        if (isSwiping === true || dx > touch.threshold || dy > touch.threshold) {
            touch.isSwiping = isSwiping;
            const dX = touch.coors.x - touchObj.pageX; // amount scrolled
            touch.coors.x = touchObj.pageX;
            // setState({
            //     position: position - dX, // set new position
            // });
            setPosition(position - dX);
        }
        if (touch.isSwiping !== true) {
            return;
        }
        // Prevent native scrolling
        event.preventDefault();
    };

    const handleTouchEnd = (event) => {
        // Make sure we are scrolled to a valid position
        slideToPosition(position);
        touch.coors.x = 0;
        touch.coors.y = 0;
        touch.isSwiping = false;
        touch.started = false;
    };

    /**
     * Slide the timeline to a specific position. This method wil automatically cap at 0 and the maximum possible position
     * @param {number} position: The position you want to slide to
     * @return {undefined} Modifies the value by which we translate the events bar
     */
    const slideToPosition = (position, visibleWidth, totalWidth) => {
        // the width of the timeline component between the two buttons (prev and next)
        const maxPosition = Math.min(visibleWidth - totalWidth, 0); // NEVER scroll to the right
        // setState({
        //     position: Math.max(Math.min(0, position), maxPosition),
        //     maxPosition,
        // });
        setPosition(Math.max(Math.min(0, position), maxPosition));
        setMaxPosition(maxPosition);
    };

    /**
     * This method translates the timeline by a certaing amount depending on if the direction passed
     * is left or right.
     *
     * @param {string} direction The direction towards which the timeline will translates
     * @param {object} the props to use during this calcuation
     * @return {undefined} Just modifies the value by which we need to translate the events bar in place
     */
    const updateSlide = (direction, props) => {
        //  translate the timeline to the left('next')/right('prev')
        if (direction === Constants.RIGHT) {
            slideToPosition(
                position - props.visibleWidth + props.labelWidth,
                props.visibleWidth,
                props.totalWidth
            );
        } else if (direction === Constants.LEFT) {
            slideToPosition(
                position + props.visibleWidth - props.labelWidth,
                props.visibleWidth,
                props.totalWidth
            );
        }
    };

    // const centerEvent = (index, props = props) => {
    //     const event = props.events[index];
    //     slideToPosition(-event.distance);
    // };

    // render() {
    //  creating an array of list items that have an onClick handler into which
    //  passing the index of the clicked entity.
    // NOTE: Improve timeline dates handeling and eventsMinLapse handling
    const touchEvents = props.isTouchEnabled
        ? {
              onTouchStart: handleTouchStart,
              onTouchMove: handleTouchMove,
              onTouchEnd: handleTouchEnd,
          }
        : {};

    // filled value = distane from origin to the selected event
    const filledValue = props.events[props.index].distance - props.barPaddingLeft;
    const eventLineWidth = props.totalWidth - props.barPaddingLeft - props.barPaddingRight;

    return (
        <div style={{ width: `${props.width}px`, height: `${props.height}px` }} {...touchEvents}>
            <div
                className="events-wrapper"
                style={{
                    position: "relative",
                    height: "100%",
                    margin: "0 40px",
                    overflow: "hidden",
                }}
            >
                <Motion style={{ X: spring(position, props.slidingMotion) }}>
                    {({ X }) => (
                        <div
                            className="events"
                            style={{
                                position: "absolute",
                                left: 0,
                                top: 49,
                                height: 2,
                                width: props.totalWidth,
                                WebkitTransform: `translate3d(${X}, 0, 0)px`,
                                transform: `translate3d(${X}px, 0, 0)`,
                            }}
                        >
                            <EventLine
                                left={props.barPaddingLeft}
                                width={eventLineWidth}
                                fillingMotion={props.fillingMotion}
                                backgroundColor={props.styles.outline}
                            />
                            <EventLine
                                left={props.barPaddingLeft}
                                width={filledValue}
                                fillingMotion={props.fillingMotion}
                                backgroundColor={props.styles.foreground}
                            />
                            <Events
                                events={props.events}
                                selectedIndex={props.index}
                                styles={props.styles}
                                handleDateClick={props.indexClick}
                                labelWidth={props.labelWidth}
                            />
                        </div>
                    )}
                </Motion>
            </div>
            <Faders styles={props.styles} />
            <TimelineButtons
                maxPosition={maxPosition}
                position={position}
                styles={props.styles}
                updateSlide={updateSlide}
                labelWidth={props.labelWidth}
                visibleWidth={props.visibleWidth}
                totalWidth={props.totalWidth}
            />
        </div>
    );
    // }
}

EventsBar.propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    events: PropTypes.arrayOf(
        PropTypes.shape({
            distance: PropTypes.number.isRequired,
            label: PropTypes.string.isRequired,
            date: PropTypes.string.isRequired,
        })
    ).isRequired,
    isTouchEnabled: PropTypes.bool.isRequired,
    totalWidth: PropTypes.number.isRequired,
    visibleWidth: PropTypes.number.isRequired,
    index: PropTypes.number,
    styles: PropTypes.object.isRequired,
    indexClick: PropTypes.func.isRequired,
    labelWidth: PropTypes.number.isRequired,
    fillingMotion: PropTypes.object.isRequired,
    barPaddingRight: PropTypes.number.isRequired,
    barPaddingLeft: PropTypes.number.isRequired,
};

export default EventsBar;
