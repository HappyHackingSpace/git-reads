export interface Highlight {
  id: string;
  session_id: string;
  text_content: string;
  start_offset: number;
  end_offset: number;
  container_xpath: string;
  color: string;
  created_at: string;
}

export interface HighlightSelection {
  text: string;
  startOffset: number;
  endOffset: number;
  containerXPath: string;
  color: string;
}
