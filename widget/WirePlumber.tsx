import { bind, derive } from "astal";
import { Gdk } from "astal/gtk4";
import AstalWp from "gi://AstalWp";
import { Mathf } from "../util/Mathf";

const WirePlumber = function () {
  const audio = AstalWp.get_default()?.audio!;

  const speakers = bind(audio, "speakers");
  const defaultSpeaker = speakers.as((speakers) =>
    speakers.find((speaker) => speaker.is_default),
  );

  return (
    <>
      {defaultSpeaker.as((defaultSpeaker) =>
        defaultSpeaker ? (
          <menubutton
            onScroll={(_, __, dy) => {
              defaultSpeaker.set_volume(
                Mathf.clamp(
                  defaultSpeaker.volume - Mathf.sign(dy) * 0.02,
                  0.0,
                  1.0,
                ),
              );
            }}
          >
            <label
              cursor={Gdk.Cursor.new_from_name("pointer", null)}
              label={bind(defaultSpeaker, "volume").as(
                (volume) => `  ${Math.floor(volume * 100)}%`,
              )}
              hasTooltip={true}
              tooltipText={bind(defaultSpeaker, "description").as(
                (description) => description,
              )}
            />
            <popover cssClasses={["WirePlumberMenu"]}>
              <box vertical>
                {speakers.as((speakers) =>
                  speakers.map((speaker) => (
                    <button
                      cssClasses={bind(speaker, "is_default").as(
                        (is_default) => [is_default ? "active" : ""],
                      )}
                      cursor={Gdk.Cursor.new_from_name("pointer", null)}
                      onClicked={() => speaker.set_is_default(true)}
                    >
                      {speaker.description}
                    </button>
                  )),
                )}
              </box>
            </popover>
          </menubutton>
        ) : (
          <></>
        ),
      )}
    </>
  );
};

export default WirePlumber;
