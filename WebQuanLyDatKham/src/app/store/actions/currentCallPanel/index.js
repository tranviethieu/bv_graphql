export const TOGGLE_CURRENT_CALL_PANEL = '[CURRENT CALL PANEL] TOGGLE CURRENT CALL PANEL';

export function toggleCurrentCallPanel(display)
{
    return {
        type: TOGGLE_CURRENT_CALL_PANEL,
        data: display
    }
}
