import React, { useState, useRef } from 'react';
import { styled } from '@linaria/react';
import axios from 'axios';
import { LITLOOP_API_URL } from 'core/constants/urls';
import { authHeader } from 'core/api/rest-helper';

const ImportWatchlist = () => {
  const [file, setFile] = useState(null);
  const [totalRows, setTotalRows] = useState(0);
  const [imported, setImported] = useState(0);
  const [status, setStatus] = useState('idle'); // idle | uploading | done | error
  const [errorMsg, setErrorMsg] = useState('');
  const [result, setResult] = useState(null);
  const [showDropZone, setShowDropZone] = useState(false);
  const fileInputRef = useRef(null);
  const dragCounter = useRef(0);

  const countRows = (f) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target.result;
      const lines = text.split('\n').filter(line => line.trim());
      const dataLines = lines.slice(1).filter(l => l.trim());
      setTotalRows(dataLines.length);
    };
    reader.readAsText(f);
  };

  const handleFileSelect = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setStatus('idle');
    setImported(0);
    setResult(null);
    setErrorMsg('');
    countRows(f);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    dragCounter.current += 1;
    setShowDropZone(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      setShowDropZone(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    dragCounter.current = 0;
    setShowDropZone(false);
    const f = e.dataTransfer.files[0];
    if (!f) return;
    if (!f.name.endsWith('.csv')) {
      setErrorMsg('Please drop a CSV file');
      return;
    }
    setFile(f);
    setStatus('idle');
    setImported(0);
    setResult(null);
    setErrorMsg('');
    countRows(f);
  };

  const handleImport = async () => {
    if (!file) return;
    setStatus('uploading');
    setImported(0);
    setErrorMsg('');

    const formData = new FormData();
    formData.append('csv_file', file);

    try {
      const res = await axios.post(
        `${LITLOOP_API_URL}/movies/import_watchlist_csv/`,
        formData,
        { headers: { ...authHeader(), 'Content-Type': 'multipart/form-data' } }
      );
      setResult(res.data);
      setImported(res.data.movies_imported || 0);
      setStatus('done');
    } catch (err) {
      setErrorMsg(err.response?.data?.error || err.message || 'Import failed');
      setStatus('error');
    }
  };

  const progress = totalRows > 0 ? Math.min(imported / totalRows, 1) : 0;

  return (
    <Container
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Title>Import IMDb Watchlist</Title>

      <Section>
        <SectionTitle>Upload your CSV</SectionTitle>
        <Description>
          Export your watchlist from IMDb, then upload the CSV file here.
        </Description>

        <FileInputRow>
          <FileInputLabel htmlFor="csv-file">
            {file ? file.name : 'Choose CSV file'}
          </FileInputLabel>
          <HiddenInput
            id="csv-file"
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
          />
          {file && (
            <ClearBtn onClick={() => { setFile(null); setTotalRows(0); setStatus('idle'); setResult(null); setErrorMsg(''); }}>
              Clear
            </ClearBtn>
          )}
        </FileInputRow>

        {totalRows > 0 && (
          <RowCount>{totalRows} movies found in CSV</RowCount>
        )}

        {status === 'idle' && file && (
          <ImportBtn onClick={handleImport}>
            Import {totalRows} movies
          </ImportBtn>
        )}

        {status === 'uploading' && (
          <ProgressSection>
            <ProgressBar>
              <ProgressFill style={{ width: `${Math.min(progress * 100, 95)}%` }} />
            </ProgressBar>
            <ProgressLabel>Importing... {imported} / {totalRows}</ProgressLabel>
          </ProgressSection>
        )}

        {status === 'done' && (
          <ResultSection>
            <ProgressBar>
              <ProgressFill style={{ width: '100%' }} />
            </ProgressBar>
            <ResultText>
              Imported {result.movies_imported} new movies
              {result.watchlist_items_imported > 0 && (
                <> &middot; {result.watchlist_items_imported} watchlist items</>
              )}
            </ResultText>
            {result.movies_imported < totalRows && (
              <ResultSubtext>
                {totalRows - result.movies_imported} already existed or were skipped
              </ResultSubtext>
            )}
          </ResultSection>
        )}

        {status === 'error' && (
          <ErrorMsg>{errorMsg}</ErrorMsg>
        )}
      </Section>

      {showDropZone && (
        <DropZone>
          <DropZoneText>Drop CSV file here</DropZoneText>
        </DropZone>
      )}
    </Container>
  );
};

const Title = styled.h1`
  color: white;
  font-family: Verdana;
  font-size: 24px;
  margin-bottom: 1.5em;
`;

const Section = styled.div`
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 1.5em;
  margin-bottom: 1em;
`;

const SectionTitle = styled.h2`
  color: white;
  font-family: Verdana;
  font-size: 16px;
  margin: 0 0 0.5em 0;
`;

const Description = styled.p`
  color: #888;
  font-family: Verdana;
  font-size: 14px;
  margin: 0 0 1em 0;
  line-height: 1.4;
`;

const FileInputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75em;
`;

const FileInputLabel = styled.label`
  display: inline-block;
  background: #111;
  border: 1px solid #686cb9;
  border-radius: 8px;
  padding: 12px 20px;
  color: #686cb9;
  font-family: Verdana;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #686cb9;
    color: white;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const ClearBtn = styled.button`
  background: transparent;
  border: 1px solid #555;
  border-radius: 8px;
  padding: 8px 16px;
  color: #aaa;
  font-family: Verdana;
  font-size: 13px;
  cursor: pointer;

  &:hover {
    border-color: #888;
    color: white;
  }
`;

const RowCount = styled.p`
  color: #888;
  font-family: Verdana;
  font-size: 13px;
  margin: 0.75em 0 0 0;
`;

const ImportBtn = styled.button`
  background: #686cb9;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  color: white;
  font-family: Verdana;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1em;

  &:hover {
    background: #7b7fcf;
  }
`;

const ProgressSection = styled.div`
  margin-top: 1.5em;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #333;
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: #686cb9;
  border-radius: 4px;
  transition: width 0.3s ease;
`;

const ProgressLabel = styled.p`
  color: #888;
  font-family: Verdana;
  font-size: 13px;
  margin: 0.5em 0 0 0;
`;

const ResultSection = styled.div`
  margin-top: 1.5em;
`;

const ResultText = styled.p`
  color: #4ade80;
  font-family: Verdana;
  font-size: 15px;
  font-weight: 600;
  margin: 0.75em 0 0 0;
`;

const ResultSubtext = styled.p`
  color: #888;
  font-family: Verdana;
  font-size: 13px;
  margin: 0.25em 0 0 0;
`;

const DropZone = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(104, 108, 185, 0.15);
  border: 2px dashed #686cb9;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
  border-radius: 20px;
  transition: all 0.2s ease;
`;

const DropZoneText = styled.p`
  color: #686cb9;
  font-family: Verdana;
  font-size: 22px;
  font-weight: 600;
`;

const Container = styled.div`
  position: relative;
  max-width: 600px;
  margin: 2em auto;
  padding: 0 1em;
`;

const ErrorMsg = styled.p`
  color: #f87171;
  font-family: Verdana;
  font-size: 14px;
  margin-top: 1em;
`;

export default ImportWatchlist;
