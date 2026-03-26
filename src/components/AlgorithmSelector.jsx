function AlgorithmSelector({ algorithm, setAlgorithm }) {

  return (

    <div className="text-center mt-3">

      <label className="me-2">Choisir l'algorithme :</label>

      <select
        className="form-select w-25 d-inline"
        value={algorithm}
        onChange={(e) => setAlgorithm(e.target.value)}
      >

        <option value="min">Chemin minimal</option>
        <option value="max">Chemin maximal</option>

      </select>

    </div>

  );

}

export default AlgorithmSelector;